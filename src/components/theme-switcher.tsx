'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from './Catalyst/dropdown';
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/16/solid';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Dropdown>
      <DropdownButton plain>
        {theme === 'light' ? (
          <SunIcon key="light" />
        ) : theme === 'dark' ? (
          <MoonIcon key="dark" />
        ) : (
          <ComputerDesktopIcon key="system" />
        )}
      </DropdownButton>
      <DropdownMenu>
        {/* <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        > */}
        <DropdownItem onClick={() => setTheme('light')} value="light">
          <SunIcon /> <span>Light</span>
        </DropdownItem>
        <DropdownItem onClick={() => setTheme('dark')} value="dark">
          <MoonIcon /> <span>Dark</span>
        </DropdownItem>
        <DropdownItem onClick={() => setTheme('system')} value="system">
          <ComputerDesktopIcon /> <span>System</span>
        </DropdownItem>
        {/* </DropdownMenuRadioGroup> */}
      </DropdownMenu>
    </Dropdown>
  );
};

export { ThemeSwitcher };
