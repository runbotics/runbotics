import { useEffect } from 'react';

export default function useEffectAsync(effect: any, inputs: any) {
  useEffect(() => {
    effect();
  }, inputs);
}
