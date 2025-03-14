import { FC, useMemo, useState } from 'react';

import Table from '#src-app/components/tables/Table';
import { useCart, CartItem } from '#src-app/contexts/CartContext';
import Checkbox from '#src-landing/components/Checkbox';
import { Column } from 'react-table';
import useTranslations from '#src-app/hooks/useTranslations';
import { TableCell } from '@mui/material';
import { Trash } from 'react-feather';



const MarketplaceCartContainer: FC = () => {
    const { currentLanguage, translate } = useTranslations();
    const [selectedItems, setSelectedItems] = useState([]);
    const { cart, removeFromCart } = useCart();

    const tableColumns: Column<CartItem>[] = useMemo(() => [
        {
            id: 'product',
            Header: 'Product',
            accessor: 'name',
            Cell: (element) => {
                console.log(element.data, element.row.original);
                return (<div style={{display: 'flex'}}>
                    <Checkbox checked={true} label={''} />
                    <div>{element.row.original.name}</div>
                </div>)},
        },
        {
            id: 'quantity',
            accessor: 'quantity',
            Header: 'Amount',
        },
        {
            id: 'additionalParameter1',
            Header: 'Additional Parameter 1',
            Cell: (cell) => {
                return cell.row.original.additionalParameters?.at(0)?.name ?? 'test'
            }
        },
        {
            id: 'additionalParameter2',
            Header: 'Additional Parameter 2',
            Cell: (cell) => {
                return cell.row.original.additionalParameters?.at(1)?.name ?? 'test'
            }
        },
        {
            id: 'apprximatePriceFrom',
            Header: 'Approximate price from',
            Cell: cell => {
                const {price, additionalParameters} = cell.row.original;
                let sum = price;
                if(additionalParameters && additionalParameters.length > 0) {
                    additionalParameters.forEach(param => {
                        sum = sum + param.additionalPrice;
                    });
                }
                return `${sum} euro/lic.`;
            }
        },
        {
            id: 'Actions',
            Cell: cell => (
                <Trash  size={120} onClick={() => removeFromCart(cell.row.original.id)}/>
            )
        }
        
        
    ],[currentLanguage]);
    return (
        <div>
            <Table columns={tableColumns} data={cart} />

        </div>
    );
};

export default MarketplaceCartContainer;
