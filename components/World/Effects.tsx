
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const Effects = () => {
  return (
    <EffectComposer multisampling={0}>
      <Bloom 
        luminanceThreshold={0.6} 
        mipmapBlur 
        intensity={1.2} 
        radius={0.6}
        levels={8}
      />
      <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
      {/* Reduced darkness to make corners less oppressive */}
      <Vignette eskil={false} offset={0.1} darkness={0.35} />
    </EffectComposer>
  );
};
