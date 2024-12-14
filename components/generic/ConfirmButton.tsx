'use client';
import { useClickAway } from '@uidotdev/usehooks';
import cn from '@utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import Button from './Button';

const ConfirmButton = ({
  revertDelay = 3600,
  onConfirm,
  onComplete = () => {},
  children,
}: {
  revertDelay?: number;
  onConfirm: () => void;
  onComplete?: () => void;
  children: (props: { confirm: boolean; isLoading: boolean }) => ReactNode;
}) => {
  const [clickedDeleteOnce, setClickedDeleteOnce] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const confirmDeleteRef = useClickAway<HTMLButtonElement>(() => {
    setClickedDeleteOnce(false);
  });

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);

    onComplete();
  };

  useEffect(() => {
    const timeout = setTimeout(() => setClickedDeleteOnce(false), revertDelay);

    return () => clearTimeout(timeout);
  }, [clickedDeleteOnce]);

  return (
    <Button
      className={cn('relative overflow-hidden', clickedDeleteOnce ? 'text-alizarin-crimson-500' : '')}
      variant="outline"
      type="button"
      onClick={() => {
        if (!clickedDeleteOnce) return setClickedDeleteOnce(true);

        handleConfirm();
      }}
      isLoading={isLoading}
      disabled={isLoading}
      ref={confirmDeleteRef}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          initial={{
            opacity: 0,
            y: -42,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 42,
          }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
          key={clickedDeleteOnce ? 'confirm' : 'idle'}
        >
          {children({ confirm: clickedDeleteOnce, isLoading })}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
};

export default ConfirmButton;
