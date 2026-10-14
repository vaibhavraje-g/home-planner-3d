import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * Exports any Three.js Group or Scene directly into a glTF 2.0 Binary (.GLB)
 * file that can be opened natively in Blender, Unreal Engine 5, Unity, or 3ds Max.
 */
export function exportHouseToGLB(
  houseGroup: THREE.Group,
  roofGroup?: THREE.Group,
  filename = 'villa_37x50_asian_paints_model.glb'
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const exportRoot = new THREE.Group();
      exportRoot.name = 'Villa_37x50_Root';

      // Clone geometries and materials so export doesn't mutate live scene
      const houseClone = houseGroup.clone(true);
      exportRoot.add(houseClone);

      if (roofGroup) {
        const roofClone = roofGroup.clone(true);
        exportRoot.add(roofClone);
      }

      const exporter = new GLTFExporter();
      exporter.parse(
        exportRoot,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: 'model/gltf-binary' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1500);
            resolve(true);
          } else {
            const output = JSON.stringify(result, null, 2);
            const blob = new Blob([output], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename.replace('.glb', '.gltf');
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1500);
            resolve(true);
          }
        },
        (error) => {
          console.error('[GLTFExporter Error]', error);
          reject(error);
        },
        {
          binary: true,
          includeCustomExtensions: true,
          embedImages: true
        }
      );
    } catch (err) {
      console.error('[Export Exception]', err);
      reject(err);
    }
  });
}
