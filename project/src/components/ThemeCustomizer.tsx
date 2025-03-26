import React from 'react';
import { motion } from 'framer-motion';
import { Check, Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { themes } from '../lib/themes';

const ThemeCustomizer = () => {
  const { theme, setTheme, activeTheme, setActiveTheme, isCustomizerOpen } = useTheme();

  const handleThemeChange = (themeName: string) => {
    setActiveTheme(themeName);
  };

  if (!isCustomizerOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 right-6 z-50 w-[280px] rounded-lg border border-border bg-background/90 backdrop-blur-sm p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Customize</h3>
          <p className="text-xs text-muted-foreground">
            Pick a color and mode for your interface.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Color */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Color</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(themes).map(([name, themeData]) => (
              <button
                key={name}
                onClick={() => handleThemeChange(name)}
                className={`group relative h-8 rounded-md hover:ring-2 hover:ring-ring transition-colors overflow-hidden
                  ${activeTheme === name ? 'ring-2 ring-ring' : 'ring-1 ring-border'}`}
                style={{
                  backgroundColor: `hsl(${themeData.cssVars[theme].primary})`
                }}
              >
                {activeTheme === name && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-primary-foreground" />
                )}
                <span className="sr-only">{themeData.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'light', icon: Sun },
              { value: 'dark', icon: Moon }
            ].map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value as 'light' | 'dark')}
                className={`inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-xs font-medium capitalize ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                  ${theme === value 
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                <Icon className="h-3 w-3" />
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeCustomizer;