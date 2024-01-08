import { useEffect, useRef } from "react";

export default function useIsFirstMount() {
  const mountRef = useRef(false);

  useEffect(() => { mountRef.current = true }, []);

  return () => mountRef.current;
}
