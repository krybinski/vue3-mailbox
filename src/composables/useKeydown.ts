import { onBeforeUnmount } from 'vue';

interface KeyCombo {
  key: string;
  fn: () => void;
}

const useKeydown = (keyCombo: KeyCombo[]) => {
  const onKeydown = (event: KeyboardEvent) => {
    const kc = keyCombo.find((kc) => kc.key === event.key);

    if (kc) {
      kc.fn();
    }
  };

  window.addEventListener('keydown', onKeydown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
  });
};

export default useKeydown;
