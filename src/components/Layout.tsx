import { KeyIcon } from '@heroicons/react/24/outline';
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from './Catalyst/sidebar';
import { SidebarLayout } from './Catalyst/sidebar-layout';
import { HomeIcon } from '@heroicons/react/20/solid';
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from './Catalyst/navbar';

const navigation = [{ name: 'Home', href: '/', icon: HomeIcon }];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection className="max-lg:hidden">
              <KeyIcon aria-hidden="true" className="h-8 text-cyan-500" />
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navigation.map((item) => (
                <SidebarItem key={item.name} href={item.href}>
                  <item.icon />
                  <SidebarLabel>{item.name}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <SidebarItem href="/login">
              <SidebarLabel>Login</SidebarLabel>
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>
      }
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/login">Login</NavbarItem>
          </NavbarSection>
        </Navbar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
