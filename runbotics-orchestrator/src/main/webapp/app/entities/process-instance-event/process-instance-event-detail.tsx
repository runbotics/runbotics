import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './process-instance-event.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProcessInstanceEventDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessInstanceEventDetail = (props: IProcessInstanceEventDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { processInstanceEventEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="processInstanceEventDetailsHeading">
          <Translate contentKey="runboticsApp.processInstanceEvent.detail.title">ProcessInstanceEvent</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{processInstanceEventEntity.id}</dd>
          <dt>
            <span id="created">
              <Translate contentKey="runboticsApp.processInstanceEvent.created">Created</Translate>
            </span>
          </dt>
          <dd>
            {processInstanceEventEntity.created ? (
              <TextFormat value={processInstanceEventEntity.created} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="log">
              <Translate contentKey="runboticsApp.processInstanceEvent.log">Log</Translate>
            </span>
          </dt>
          <dd>{processInstanceEventEntity.log}</dd>
          <dt>
            <span id="step">
              <Translate contentKey="runboticsApp.processInstanceEvent.step">Step</Translate>
            </span>
          </dt>
          <dd>{processInstanceEventEntity.step}</dd>
          <dt>
            <Translate contentKey="runboticsApp.processInstanceEvent.processInstance">Process Instance</Translate>
          </dt>
          <dd>{processInstanceEventEntity.processInstance ? processInstanceEventEntity.processInstance.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/process-instance-event" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/process-instance-event/${processInstanceEventEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ processInstanceEvent }: IRootState) => ({
  processInstanceEventEntity: processInstanceEvent.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessInstanceEventDetail);
