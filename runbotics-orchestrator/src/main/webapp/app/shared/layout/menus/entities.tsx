import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    data-cy="entity"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="asterisk" to="/process">
      <Translate contentKey="global.menu.entities.process" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/bot">
      <Translate contentKey="global.menu.entities.bot" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/schedule-process">
      <Translate contentKey="global.menu.entities.scheduleProcess" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/process-instance">
      <Translate contentKey="global.menu.entities.processInstance" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/process-instance-event">
      <Translate contentKey="global.menu.entities.processInstanceEvent" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/activity">
      <Translate contentKey="global.menu.entities.activity" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/action">
      <Translate contentKey="global.menu.entities.action" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/documentation-page">
      <Translate contentKey="global.menu.entities.documentationPage" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
