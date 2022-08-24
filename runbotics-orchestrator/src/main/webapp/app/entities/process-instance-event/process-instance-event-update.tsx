import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { setFileData, byteSize, Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProcessInstance } from 'app/shared/model/process-instance.model';
import { getEntities as getProcessInstances } from 'app/entities/process-instance/process-instance.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './process-instance-event.reducer';
import { IProcessInstanceEvent } from 'app/shared/model/process-instance-event.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProcessInstanceEventUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessInstanceEventUpdate = (props: IProcessInstanceEventUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { processInstanceEventEntity, processInstances, loading, updating } = props;

  const { log } = processInstanceEventEntity;

  const handleClose = () => {
    props.history.push('/process-instance-event' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getProcessInstances();
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

    if (errors.length === 0) {
      const entity = {
        ...processInstanceEventEntity,
        ...values,
        processInstance: processInstances.find(it => it.id.toString() === values.processInstanceId.toString()),
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
          <h2 id="runboticsApp.processInstanceEvent.home.createOrEditLabel" data-cy="ProcessInstanceEventCreateUpdateHeading">
            <Translate contentKey="runboticsApp.processInstanceEvent.home.createOrEditLabel">
              Create or edit a ProcessInstanceEvent
            </Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : processInstanceEventEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="process-instance-event-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="process-instance-event-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="createdLabel" for="process-instance-event-created">
                  <Translate contentKey="runboticsApp.processInstanceEvent.created">Created</Translate>
                </Label>
                <AvInput
                  id="process-instance-event-created"
                  data-cy="created"
                  type="datetime-local"
                  className="form-control"
                  name="created"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processInstanceEventEntity.created)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="logLabel" for="process-instance-event-log">
                  <Translate contentKey="runboticsApp.processInstanceEvent.log">Log</Translate>
                </Label>
                <AvInput id="process-instance-event-log" data-cy="log" type="textarea" name="log" />
              </AvGroup>
              <AvGroup>
                <Label id="stepLabel" for="process-instance-event-step">
                  <Translate contentKey="runboticsApp.processInstanceEvent.step">Step</Translate>
                </Label>
                <AvField id="process-instance-event-step" data-cy="step" type="text" name="step" />
              </AvGroup>
              <AvGroup>
                <Label for="process-instance-event-processInstance">
                  <Translate contentKey="runboticsApp.processInstanceEvent.processInstance">Process Instance</Translate>
                </Label>
                <AvInput
                  id="process-instance-event-processInstance"
                  data-cy="processInstance"
                  type="select"
                  className="form-control"
                  name="processInstanceId"
                >
                  <option value="" key="0" />
                  {processInstances
                    ? processInstances.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/process-instance-event" replace color="info">
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
  processInstances: storeState.processInstance.entities,
  processInstanceEventEntity: storeState.processInstanceEvent.entity,
  loading: storeState.processInstanceEvent.loading,
  updating: storeState.processInstanceEvent.updating,
  updateSuccess: storeState.processInstanceEvent.updateSuccess,
});

const mapDispatchToProps = {
  getProcessInstances,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessInstanceEventUpdate);
