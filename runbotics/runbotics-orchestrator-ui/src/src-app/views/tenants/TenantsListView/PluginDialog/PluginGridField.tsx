import { FC } from 'react';

import { Tenant } from 'runbotics-common';

import PluginIcon from '#public/images/icons/plugin_icon.svg';

export const PluginGridField: FC<{ row: Tenant }> = ({ row }) => (
    <div>
        <PluginIcon />
        <p>
            {row.licenses?.length} Plugins Selected
        </p>
    </div>
);
