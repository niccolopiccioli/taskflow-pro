'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { COMPARISON_MATRIX } from '@/lib/plans';
import { cn } from '@/lib/utils';

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="h-4 w-4 text-primary mx-auto" />;
  }
  if (value === false) {
    return <Lock className="h-3.5 w-3.5 text-muted-foreground/50 mx-auto" />;
  }
  return <span className="text-xs sm:text-sm">{value}</span>;
}

export function PlanComparisonMatrix() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card/30"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="sticky left-0 z-10 bg-muted/30 px-4 py-4 text-sm font-semibold">
                Funzionalità
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-center w-28">Gratuito</th>
              <th className="px-4 py-4 text-sm font-semibold text-center w-28 text-primary">Pro</th>
              <th className="px-4 py-4 text-sm font-semibold text-center w-28 text-amber-400">
                Business
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_MATRIX.map((section) => (
              <Fragment key={section.category}>
                <tr className="bg-muted/20">
                  <td
                    colSpan={4}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {section.category}
                  </td>
                </tr>
                {section.rows.map((row, i) => (
                  <motion.tr
                    key={row.label}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className={cn('border-b border-border/40 hover:bg-muted/10 transition-colors')}
                  >
                    <td className="sticky left-0 z-10 bg-background/95 backdrop-blur px-4 py-3 text-sm">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CellValue value={row.free} />
                    </td>
                    <td className="px-4 py-3 text-center bg-primary/[0.03]">
                      <CellValue value={row.pro} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CellValue value={row.business} />
                    </td>
                  </motion.tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
