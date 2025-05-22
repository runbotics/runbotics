import { FC } from 'react';

import { DeleteOutline } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { CartItem, SelectedParameter, useCart } from '#src-app/contexts/CartContext';

import { ParameterSelect } from '#src-landing/components/MarketplaceCartAccordion/ParameterSelect/ParameterSelect';
import Typography from '#src-landing/components/Typography';

import styles from './MarketplaceCartAccordion.module.scss';

export const AccordionElement: FC<CartItem> = (offer) => {
    const { removeFromCart, updateCartItem } = useCart();
    const updateParameter = (parameter: SelectedParameter) => {
        const newSelection = structuredClone(offer.selectedParameters);
        const index = newSelection.findIndex(option => option.name === parameter.name);
        newSelection[index] = parameter;
        
        if(!newSelection) {
            updateCartItem(offer.slug, {
                selectedParameters: [parameter]
            });
            return;
        }
        if (newSelection) {
            updateCartItem(offer.slug, {
                selectedParameters: newSelection,
            });
        }

    };
    return (
        <Accordion className={styles.accordion}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id={offer.slug}
            >
                <div className={styles.accordionSummary}>
                    <Typography variant={'h5'}>{offer.title}</Typography>
                    <p className={styles.deleteButton}>
                        <DeleteOutline
                            sx={{
                                color: 'red',
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                removeFromCart(offer.slug);
                            }}
                        />
                    </p>
                </div>
            </AccordionSummary>
            <AccordionDetails className={styles.accordionDetails}>
                {
                    offer.parameters?.additionalParameters?.map(parameter => {
                        const selectedParameter = offer.selectedParameters
                            ?.find(selected => selected.name === parameter.name);
                        const selectedOption = parameter.options
                            .find(option => option.name === selectedParameter?.selectedOption || (!selectedParameter && option.isDefault));

                        if (!selectedOption) {
                            return null;
                        }
                        return (
                            <div key={parameter.name}  className={styles.parameterWrapper}>
                                <Typography variant={'h6'} color={'primary'}>{parameter.name}</Typography>
                                <ParameterSelect selectedOption={selectedOption} options={parameter.options}
                                    onChange={(newValue) => updateParameter({
                                        name: parameter.name,
                                        selectedOption: newValue,
                                    })}
                                />
                            </div>
                        );
                    })
                }
            </AccordionDetails>
        </Accordion>
    );
};
