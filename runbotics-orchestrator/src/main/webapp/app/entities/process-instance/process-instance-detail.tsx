import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './process-instance.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProcessInstanceDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessInstanceDetail = (props: IProcessInstanceDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { processInstanceEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="processInstanceDetailsHeading">
          <Translate contentKey="runboticsApp.processInstance.detail.title">ProcessInstance</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="runboticsApp.processInstance.id">Id</Translate>
            </span>
          </dt>
          <dd>{processInstanceEntity.id}</dd>
          <dt>
            <span id="orchestratorProcessInstanceId">
              <Translate contentKey="runboticsApp.processInstance.orchestratorProcessInstanceId">
                Orchestrator Process Instance Id
              </Translate>
            </span>
          </dt>
          <dd>{processInstanceEntity.orchestratorProcessInstanceId}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="runboticsApp.processInstance.status">Status</Translate>
            </span>
          </dt>
          <dd>{processInstanceEntity.status}</dd>
          <dt>
            <span id="created">
              <Translate contentKey="runboticsApp.processInstance.created">Created</Translate>
            </span>
          </dt>
          <dd>
            {processInstanceEntity.created ? (
              <TextFormat value={processInstanceEntity.created} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updated">
              <Translate contentKey="runboticsApp.processInstance.updated">Updated</Translate>
            </span>
          </dt>
          <dd>
            {processInstanceEntity.updated ? (
              <TextFormat value={processInstanceEntity.updated} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="input">
              <Translate contentKey="runboticsApp.processInstance.input">Input</Translate>
            </span>
          </dt>
          <dd>{processInstanceEntity.input}</dd>
          <dt>
            <span id="output">
              <Translate contentKey="runboticsApp.processInstance.output">Output</Translate>
            </span>
          </dt>
          <dd>{processInstanceEntity.output}</dd>
          <dt>
            <span id="step">
              <Translate contentKey="runboticsApp.processInstance.step">Step</Translate>
            </span>
          </dt>
          <dd>{processInstanceEntity.step}</dd>
          <dt>
            <Translate contentKey="runboticsApp.processInstance.process">Process</Translate>
          </dt>
          <dd>{processInstanceEntity.process ? processInstanceEntity.process.name : ''}</dd>
          <dt>
            <Translate contentKey="runboticsApp.processInstance.bot">Bot</Translate>
          </dt>
          <dd>{processInstanceEntity.bot ? processInstanceEntity.bot.installationId : ''}</dd>
        </dl>
        <Button tag={Link} to="/process-instance" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/process-instance/${processInstanceEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ processInstance }: IRootState) => ({
  processInstanceEntity: processInstance.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessInstanceDetail);
