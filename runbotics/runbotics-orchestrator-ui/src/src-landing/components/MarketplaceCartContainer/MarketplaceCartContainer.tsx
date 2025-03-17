import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';

import { Trash } from 'react-feather';
import { FC, useMemo, useState } from 'react';

import { Trash } from 'react-feather';
import { Column } from 'react-table';

import Table from '#src-app/components/tables/Table';
import { CartItem, useCart } from '#src-app/contexts/CartContext';
import useTranslations from '#src-app/hooks/useTranslations';
import Checkbox from '#src-landing/components/Checkbox';

import styles from './MarketplaceCartContainer.module.scss';

interface Props{
    selectedItems: string[];
    setSelectedItems: Dispatch<SetStateAction<string[]>>;
}

const MarketplaceCartContainer: FC<Props> = ({setSelectedItems, selectedItems}) => {
    const { currentLanguage, translate } = useTranslations();
    const { cart, removeFromCart } = useCart();

    const tableColumns: Column<CartItem>[] = useMemo(() => [
        {
            id: 'isSelected',
            Cell: (cell) => <Checkbox checked={selectedItems.includes(cell.row.original.id)} label={''}
                onClick={() => {
                    setSelectedItems(prev => {
                        if (prev.includes(cell.row.original.id)) {
                            return prev.filter(item => item !== cell.row.original.id);
                        }
                        return [...prev, cell.row.original.id];
                    });
                }} />,
        },
        {
            id: 'product',
            Header: translate('Marketplace.Cart.Product'),
            accessor: 'name',
        },
        {
            id: 'quantity',
            accessor: 'quantity',
            Header: () => (
                <div>
                    <p>{translate('Marketplace.Cart.Quantity')}</p>
                    <p>{translate('Marketplace.Cart.QuantityHelp')}</p>
                </div>
            ),
        },
        {
            id: 'additionalParameter1',
            Header: 'Additional Parameter 1',
            Cell: (cell) => cell.row.original.additionalParameters?.at(0)?.name ?? 'test',
        },
        {
            id: 'additionalParameter2',
            Header: 'Additional Parameter 2',
            Cell: (cell) => cell.row.original.additionalParameters?.at(1)?.name ?? 'test',
        },
        {
            id: 'apprximatePriceFrom',
            Header: translate('Marketplace.Cart.ApproximatePriceFrom'),
            Cell: cell => {
                const { price, additionalParameters } = cell.row.original;
                let sum = price;
                if (additionalParameters && additionalParameters.length > 0) {
                    additionalParameters.forEach(param => {
                        sum = sum + param.additionalPrice;
                    });
                }
                return `${sum} euro/lic.`;
            },
        },
        {
            id: 'Actions',
            Cell: cell => (
                <Trash
                    size={20}
                    color={'red'}
                    cursor={'pointer'}
                    onClick={() => removeFromCart(cell.row.original.id)}
                />
            ),
        },

    ], [currentLanguage, selectedItems]);

    return (
        <div className={styles.root}>
            <Table columns={tableColumns} data={cart} />
        </div>
    );
};

export default MarketplaceCartContainer;
