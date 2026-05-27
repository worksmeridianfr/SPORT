import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineShopping, AiOutlineLock, AiOutlineCheck } from 'react-icons/ai';
import { SHOP_ITEMS } from '@/data/exercises';
import type { PurchasedItem } from '@/types';

interface ShopPageProps {
  mpBalance: number;
  purchasedItems: PurchasedItem[];
  onPurchase: (itemId: string) => boolean;
}

export function ShopPage({ mpBalance, purchasedItems, onPurchase }: ShopPageProps) {
  const [confirmingItem, setConfirmingItem] = useState<string | null>(null);

  const purchasedIds = new Set(purchasedItems.map((p) => p.item.id));

  const handlePurchase = (itemId: string) => {
    const success = onPurchase(itemId);
    if (success) {
      setConfirmingItem(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <AiOutlineShopping size={16} className="text-rosso" />
          <span
            className="font-display text-rosso text-sm"
            style={{ letterSpacing: '0.1em' }}
          >
            BOUTIQUE
          </span>
        </div>
        <h1
          className="font-display text-3xl sm:text-4xl text-polar mb-2"
          style={{ letterSpacing: '0.12em' }}
        >
          RECOMPENSES
        </h1>
        <p className="text-ash text-xs" style={{ letterSpacing: '0.022em' }}>
          Depensez vos MP gagnes lors de vos seances d entrainement
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-graphite border border-steel px-4 py-2">
          <span className="text-ash text-xs">Solde:</span>
          <span
            className="font-display text-rosso text-lg"
            style={{ letterSpacing: '0.05em' }}
          >
            {mpBalance} MP
          </span>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHOP_ITEMS.map((item, index) => {
          const isPurchased = purchasedIds.has(item.id);
          const canAfford = mpBalance >= item.price;
          const isConfirming = confirmingItem === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-graphite border border-steel overflow-hidden"
            >
              {/* Image */}
              <div className="h-32 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3
                  className="font-display text-polar text-base mb-1"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {item.name}
                </h3>
                <p className="text-ash text-xs mb-3" style={{ letterSpacing: '0.015em' }}>
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className="font-display text-rosso text-lg"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {item.price} MP
                  </span>

                  {isPurchased ? (
                    <div className="flex items-center gap-1.5 text-xs text-polar">
                      <AiOutlineCheck size={14} className="text-rosso" />
                      <span>Acquis</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingItem(item.id)}
                      disabled={!canAfford}
                      className={
                        'flex items-center gap-1.5 px-4 py-2 font-display text-xs tracking-widest transition-colors ' +
                        (canAfford
                          ? 'bg-polar text-obsidian hover:bg-ash'
                          : 'bg-steel text-ash cursor-not-allowed')
                      }
                      style={{ letterSpacing: '0.06em' }}
                    >
                      {!canAfford && <AiOutlineLock size={12} />}
                      ACHETER
                    </button>
                  )}
                </div>
              </div>

              {/* Confirmation Dialog */}
              <AnimatePresence>
                {isConfirming && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-obsidian/95 flex flex-col items-center justify-center p-5 z-10"
                  >
                    <h4
                      className="font-display text-polar text-lg mb-2 text-center"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      CONFIRMER L ACHAT
                    </h4>
                    <p className="text-ash text-xs text-center mb-1">
                      {item.name}
                    </p>
                    <p className="text-rosso font-display text-sm mb-4" style={{ letterSpacing: '0.05em' }}>
                      {item.price} MP
                    </p>
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => setConfirmingItem(null)}
                        className="flex-1 py-2 border border-steel text-ash font-display text-xs tracking-widest hover:border-polar hover:text-polar transition-colors"
                        style={{ letterSpacing: '0.06em' }}
                      >
                        ANNULER
                      </button>
                      <button
                        onClick={() => handlePurchase(item.id)}
                        className="flex-1 py-2 bg-rosso text-polar font-display text-xs tracking-widest hover:brightness-110 transition-all"
                        style={{ letterSpacing: '0.06em' }}
                      >
                        CONFIRMER
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Purchased Items Section */}
      {purchasedItems.length > 0 && (
        <div className="mt-12">
          <h2
            className="font-display text-polar text-xl mb-4"
            style={{ letterSpacing: '0.1em' }}
          >
            MES ACHATS
          </h2>
          <div className="space-y-2">
            {purchasedItems.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-graphite border border-steel px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <AiOutlineCheck size={14} className="text-rosso" />
                  <span className="text-polar text-xs" style={{ letterSpacing: '0.022em' }}>
                    {p.item.name}
                  </span>
                </div>
                <span className="text-ash text-xs">
                  {new Date(p.purchaseDate).toLocaleDateString('fr-FR')}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
