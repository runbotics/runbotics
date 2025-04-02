import { FC } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { CartItem } from '#src-app/contexts/CartContext';

import Typography from '#src-landing/components/Typography';

import styles from './MarketplaceCartAccordion.module.scss';

export const AccordionElement: FC<CartItem> = (offer) => (
    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={offer.slug}
        >
            <div className={styles.accordionSummary}>
                <Typography variant={'h6'}>{offer.title}</Typography>
                <p>Amount: {offer.quantity}</p>
            </div>
        </AccordionSummary>
        <AccordionDetails>
            {
                offer.parameters.additionalParameters?.map(parameter => {
                    const selectedParameter = offer.selectedParameters
                        ?.find(selected => selected.name === parameter.name);
                    const selectedOption = parameter.options
                        .find(option => option.name === selectedParameter?.selectedOption);
                        
                    if(selectedOption) {
                        return (
                            <div key={parameter.name}>
                                <Typography variant={'h6'}>{parameter.name}</Typography>
                                <Typography>{selectedOption.name}</Typography>
                            </div>
                        );
                    } 
                    return (
                        <div key={parameter.name}>
                            <Typography variant={'h6'}>{parameter.name}:</Typography>
                            <Typography>
                                {parameter.options.find(option => option.isDefault)?.name}
                            </Typography>
                        </div>
                    );
                    
                },
                )
            }
        </AccordionDetails>
    </Accordion>
);
