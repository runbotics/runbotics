import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { setFileData, byteSize, Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProcess } from 'app/shared/model/process.model';
import { getEntities as getProcesses } from 'app/entities/process/process.reducer';
import { IBot } from 'app/shared/model/bot.model';
import { getEntities as getBots } from 'app/entities/bot/bot.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './process-instance.reducer';
import { IProcessInstance } from 'app/shared/model/process-instance.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProcessInstanceUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessInstanceUpdate = (props: IProcessInstanceUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { processInstanceEntity, processes, bots, loading, updating } = props;

  const { input, output } = processInstanceEntity;

  const handleClose = () => {
    props.history.push('/process-instance' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getProcesses();
    props.getBots();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.created = convertDateTimeToServer(values.created);
    values.updated = convertDateTimeToServer(values.updated);

    if (errors.length === 0) {
      const entity = {
        ...processInstanceEntity,
        ...values,
        process: processes.find(it => it.id.toString() === values.processId.toString()),
        bot: bots.find(it => it.id.toString() === values.botId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="runboticsApp.processInstance.home.createOrEditLabel" data-cy="ProcessInstanceCreateUpdateHeading">
            <Translate contentKey="runboticsApp.processInstance.home.createOrEditLabel">Create or edit a ProcessInstance</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : processInstanceEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="process-instance-id">
                    <Translate contentKey="runboticsApp.processInstance.id">Id</Translate>
                  </Label>
                  <AvInput id="process-instance-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="orchestratorProcessInstanceIdLabel" for="process-instance-orchestratorProcessInstanceId">
                  <Translate contentKey="runboticsApp.processInstance.orchestratorProcessInstanceId">
                    Orchestrator Process Instance Id
                  </Translate>
                </Label>
                <AvField
                  id="process-instance-orchestratorProcessInstanceId"
                  data-cy="orchestratorProcessInstanceId"
                  type="text"
                  name="orchestratorProcessInstanceId"
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="process-instance-status">
                  <Translate contentKey="runboticsApp.processInstance.status">Status</Translate>
                </Label>
                <AvField id="process-instance-status" data-cy="status" type="text" name="status" />
              </AvGroup>
              <AvGroup>
                <Label id="createdLabel" for="process-instance-created">
                  <Translate contentKey="runboticsApp.processInstance.created">Created</Translate>
                </Label>
                <AvInput
                  id="process-instance-created"
                  data-cy="created"
                  type="datetime-local"
                  className="form-control"
                  name="created"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processInstanceEntity.created)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="updatedLabel" for="process-instance-updated">
                  <Translate contentKey="runboticsApp.processInstance.updated">Updated</Translate>
                </Label>
                <AvInput
                  id="process-instance-updated"
                  data-cy="updated"
                  type="datetime-local"
                  className="form-control"
                  name="updated"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processInstanceEntity.updated)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="inputLabel" for="process-instance-input">
                  <Translate contentKey="runboticsApp.processInstance.input">Input</Translate>
                </Label>
                <AvInput id="process-instance-input" data-cy="input" type="textarea" name="input" />
              </AvGroup>
              <AvGroup>
                <Label id="outputLabel" for="process-instance-output">
                  <Translate contentKey="runboticsApp.processInstance.output">Output</Translate>
                </Label>
                <AvInput id="process-instance-output" data-cy="output" type="textarea" name="output" />
              </AvGroup>
              <AvGroup>
                <Label id="stepLabel" for="process-instance-step">
                  <Translate contentKey="runboticsApp.processInstance.step">Step</Translate>
                </Label>
                <AvField id="process-instance-step" data-cy="step" type="text" name="step" />
              </AvGroup>
              <AvGroup>
                <Label for="process-instance-process">
                  <Translate contentKey="runboticsApp.processInstance.process">Process</Translate>
                </Label>
                <AvInput id="process-instance-process" data-cy="process" type="select" className="form-control" name="processId" required>
                  <option value="" key="0" />
                  {processes
                    ? processes.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="process-instance-bot">
                  <Translate contentKey="runboticsApp.processInstance.bot">Bot</Translate>
                </Label>
                <AvInput id="process-instance-bot" data-cy="bot" type="select" className="form-control" name="botId" required>
                  <option value="" key="0" />
                  {bots
                    ? bots.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.installationId}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/process-instance" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  processes: storeState.process.entities,
  bots: storeState.bot.entities,
  processInstanceEntity: storeState.processInstance.entity,
  loading: storeState.processInstance.loading,
  updating: storeState.processInstance.updating,
  updateSuccess: storeState.processInstance.updateSuccess,
});

const mapDispatchToProps = {
  getProcesses,
  getBots,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessInstanceUpdate);
