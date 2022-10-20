import React, { VFC } from 'react';
import List from '@mui/material/List';
import NavbarItem from './NavbarItem';
import { Item } from './Navbar.types';
import { useRouter } from 'next/router';

interface NavbarListProps {
    items: Item[];
    pathname: string;
    depth?: number;
    mobile?: boolean;
}

const NavbarList: VFC<NavbarListProps> = ({ items, pathname, depth = 0, mobile }) => (
    <List disablePadding>
        {items.reduce((acc, item) => {
            const key = `${item.title}${depth}`;
            const { pathname } = useRouter();
            const page = pathname.split('/')[2];
            const open = item.href.includes(page);

            if (item.items) {
                acc.push(
                    <NavbarItem
                        key={key}
                        depth={depth}
                        icon={item.icon}
                        info={item.info}
                        open={!!open}
                        title={item.title}
                        mobile={mobile}
                    >
                        <NavbarList depth={depth + 1} pathname={pathname} items={item.items} mobile={mobile} />
                    </NavbarItem>,
                );
            } else {
                acc.push(
                    <NavbarItem
                        key={key}
                        depth={depth}
                        href={item.href}
                        icon={item.icon}
                        info={item.info}
                        title={item.title}
                        mobile={mobile}
                        open={!!open}
                    />,
                );
            }

            return acc;
        }, [])}
    </List>
);

export default NavbarList;
