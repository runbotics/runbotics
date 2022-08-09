import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './process.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProcessDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessDetail = (props: IProcessDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { processEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="processDetailsHeading">
          <Translate contentKey="runboticsApp.process.detail.title">Process</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{processEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="runboticsApp.process.name">Name</Translate>
            </span>
          </dt>
          <dd>{processEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="runboticsApp.process.description">Description</Translate>
            </span>
          </dt>
          <dd>{processEntity.description}</dd>
          <dt>
            <span id="definition">
              <Translate contentKey="runboticsApp.process.definition">Definition</Translate>
            </span>
          </dt>
          <dd>{processEntity.definition}</dd>
          <dt>
            <span id="isPublic">
              <Translate contentKey="runboticsApp.process.isPublic">Is Public</Translate>
            </span>
          </dt>
          <dd>{processEntity.isPublic ? 'true' : 'false'}</dd>
          <dt>
            <span id="created">
              <Translate contentKey="runboticsApp.process.created">Created</Translate>
            </span>
          </dt>
          <dd>{processEntity.created ? <TextFormat value={processEntity.created} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updated">
              <Translate contentKey="runboticsApp.process.updated">Updated</Translate>
            </span>
          </dt>
          <dd>{processEntity.updated ? <TextFormat value={processEntity.updated} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="executionsCount">
              <Translate contentKey="runboticsApp.process.executionsCount">Executions Count</Translate>
            </span>
          </dt>
          <dd>{processEntity.executionsCount}</dd>
          <dt>
            <span id="successExecutionsCount">
              <Translate contentKey="runboticsApp.process.successExecutionsCount">Success Executions Count</Translate>
            </span>
          </dt>
          <dd>{processEntity.successExecutionsCount}</dd>
          <dt>
            <span id="failureExecutionsCount">
              <Translate contentKey="runboticsApp.process.failureExecutionsCount">Failure Executions Count</Translate>
            </span>
          </dt>
          <dd>{processEntity.failureExecutionsCount}</dd>
          <dt>
            <Translate contentKey="runboticsApp.process.createdBy">Created By</Translate>
          </dt>
          <dd>{processEntity.createdBy ? processEntity.createdBy.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/process" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/process/${processEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ process }: IRootState) => ({
  processEntity: process.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessDetail);
