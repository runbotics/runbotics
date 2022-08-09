import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './global-variable.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IGlobalVariableDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const GlobalVariableDetail = (props: IGlobalVariableDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { globalVariableEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="globalVariableDetailsHeading">
          <Translate contentKey="runboticsApp.globalVariable.detail.title">GlobalVariable</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{globalVariableEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="runboticsApp.globalVariable.name">Name</Translate>
            </span>
          </dt>
          <dd>{globalVariableEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="runboticsApp.globalVariable.description">Description</Translate>
            </span>
          </dt>
          <dd>{globalVariableEntity.description}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="runboticsApp.globalVariable.type">Type</Translate>
            </span>
          </dt>
          <dd>{globalVariableEntity.type}</dd>
          <dt>
            <span id="value">
              <Translate contentKey="runboticsApp.globalVariable.value">Value</Translate>
            </span>
          </dt>
          <dd>{globalVariableEntity.value}</dd>
          <dt>
            <span id="lastModified">
              <Translate contentKey="runboticsApp.globalVariable.lastModified">Last Modified</Translate>
            </span>
          </dt>
          <dd>
            {globalVariableEntity.lastModified ? (
              <TextFormat value={globalVariableEntity.lastModified} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="runboticsApp.globalVariable.user">User</Translate>
          </dt>
          <dd>{globalVariableEntity.user ? globalVariableEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/global-variable" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/global-variable/${globalVariableEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ globalVariable }: IRootState) => ({
  globalVariableEntity: globalVariable.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(GlobalVariableDetail);
