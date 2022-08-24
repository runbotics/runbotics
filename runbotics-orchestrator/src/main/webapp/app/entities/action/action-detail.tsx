import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './action.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IActionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ActionDetail = (props: IActionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { actionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="actionDetailsHeading">
          <Translate contentKey="runboticsApp.action.detail.title">Action</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="runboticsApp.action.id">Id</Translate>
            </span>
          </dt>
          <dd>{actionEntity.id}</dd>
          <dt>
            <span id="label">
              <Translate contentKey="runboticsApp.action.label">Label</Translate>
            </span>
          </dt>
          <dd>{actionEntity.label}</dd>
          <dt>
            <span id="script">
              <Translate contentKey="runboticsApp.action.script">Script</Translate>
            </span>
          </dt>
          <dd>{actionEntity.script}</dd>
          <dt>
            <span id="form">
              <Translate contentKey="runboticsApp.action.form">Form</Translate>
            </span>
          </dt>
          <dd>{actionEntity.form}</dd>
        </dl>
        <Button tag={Link} to="/action" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/action/${actionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ action }: IRootState) => ({
  actionEntity: action.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ActionDetail);
