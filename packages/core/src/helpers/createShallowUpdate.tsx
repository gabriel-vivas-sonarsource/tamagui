import React, { useCallback } from 'react'

export function createShallowUpdate<State extends Object>(
  setter: React.Dispatch<React.SetStateAction<State>>
) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(
    (next: Partial<State>) => {
      setter((prev) => {
        for (const key in next) {
          if (prev[key] !== next[key]) {
            return { ...prev, ...next }
          }
        }
        return prev
      })
    },
    [setter]
  )
}
