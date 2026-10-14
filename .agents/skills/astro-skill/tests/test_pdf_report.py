from __future__ import annotations

import json
import subprocess
import sys
from datetime import date
from pathlib import Path

import pytest

from pypdf import PdfReader

SCRIPT_DIR = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPT_DIR))

from dasha_calculator import calculate_dasha  # noqa: E402
from kundali_calculator import BirthInput, calculate_kundali  # noqa: E402
from panchang_calculator import PanchangInput, calculate_panchang  # noqa: E402
from pdf_report import build_pdf_report  # noqa: E402


def reference_chart() -> dict:
    return calculate_kundali(
        BirthInput(
            dob="26/12/2019",
            tob="09:15",
            place="Delhi",
            lat=28.6139,
            lon=77.2090,
            timezone_name="Asia/Kolkata",
        )
    )


def reference_panchang() -> dict:
    return calculate_panchang(
        PanchangInput(
            date="2026-05-21",
            place="Delhi",
            lat=28.6139,
            lon=77.209,
            timezone_name="Asia/Kolkata",
        )
    )


def extract_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


# ---------- ReportLab renderer (the only supported PDF path) ----------------


def test_reportlab_renderer_contains_planet_chart_and_dasha_timeline(tmp_path: Path):
    chart = reference_chart()
    dasha = calculate_dasha(chart, on_date=date(2026, 5, 20))
    panchang = reference_panchang()
    output_path = tmp_path / "astro-report.pdf"

    build_pdf_report(
        chart,
        dasha=dasha,
        panchang=panchang,
        output_path=output_path,
        language="hi",
        renderer="reportlab",
    )

    assert output_path.exists()
    assert output_path.stat().st_size > 4_000
    text = extract_text(output_path)
    assert "जन्म कुंडली रिपोर्ट" in text
    assert "ग्रह स्थिति" in text
    assert "दशा तालिका" in text
    assert "लग्न कुंडली" in text
    assert "नवांश कुंडली (D9)" in text
    assert "Makara" in text
    assert "शुक्र/सूर्य" in text
    assert "Swiss Ephemeris (SWIEPH)" in text
    assert "Lahiri" in text
    assert date.today().isoformat() in text
    assert "Astro Skill" not in text


def test_reportlab_cli_writes_pdf(tmp_path: Path):
    chart = reference_chart()
    dasha = calculate_dasha(chart, on_date=date(2026, 5, 20))
    panchang = reference_panchang()
    chart_path = tmp_path / "chart.json"
    dasha_path = tmp_path / "dasha.json"
    panchang_path = tmp_path / "panchang.json"
    output_path = tmp_path / "report.pdf"
    chart_path.write_text(json.dumps(chart), encoding="utf-8")
    dasha_path.write_text(json.dumps(dasha), encoding="utf-8")
    panchang_path.write_text(json.dumps(panchang), encoding="utf-8")
    script = SCRIPT_DIR / "pdf_report.py"

    completed = subprocess.run(
        [
            sys.executable,
            str(script),
            "--kundali-json",
            str(chart_path),
            "--dasha-json",
            str(dasha_path),
            "--panchang-json",
            str(panchang_path),
            "--output",
            str(output_path),
            "--language",
            "hi",
            "--brand",
            "Jyotish Paramarsh",
            "--renderer",
            "reportlab",
        ],
        check=True,
        capture_output=True,
        text=True,
    )

    assert str(output_path) in completed.stdout
    assert "reportlab" in completed.stdout
    text = extract_text(output_path)
    assert "लग्न कुंडली" in text
    assert "Jyotish Paramarsh" in text


def test_pdf_report_rejects_unknown_renderer(tmp_path: Path):
    with pytest.raises(ValueError):
        build_pdf_report(
            reference_chart(),
            output_path=tmp_path / "x.pdf",
            language="hi",
            renderer="weasyprint",
        )


def test_pdf_report_rejects_unknown_template(tmp_path: Path):
    with pytest.raises(ValueError):
        build_pdf_report(
            reference_chart(),
            output_path=tmp_path / "x.pdf",
            language="hi",
            template="pandit_v1",
        )


def test_reportlab_cover_uses_client_name(tmp_path: Path):
    output_path = tmp_path / "report.pdf"

    build_pdf_report(
        reference_chart(),
        output_path=output_path,
        language="en",
        renderer="reportlab",
        client_name="Kiran Verma",
        brand="Jyotish Paramarsh",
    )

    text = extract_text(output_path)
    assert "Kiran Verma" in text
    assert "Jyotish Paramarsh" in text
    assert "Astro Skill" not in text
