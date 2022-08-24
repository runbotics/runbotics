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
import { getEntity, updateEntity, createEntity, setBlob, reset } from './activity.reducer';
import { IActivity } from 'app/shared/model/activity.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IActivityUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ActivityUpdate = (props: IActivityUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { activityEntity, processInstances, loading, updating } = props;

  const { input, output } = activityEntity;

  const handleClose = () => {
    props.history.push('/activity' + props.location.search);
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
    if (errors.length === 0) {
      const entity = {
        ...activityEntity,
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
          <h2 id="runboticsApp.activity.home.createOrEditLabel" data-cy="ActivityCreateUpdateHeading">
            <Translate contentKey="runboticsApp.activity.home.createOrEditLabel">Create or edit a Activity</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : activityEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="activity-executionId">
                    <Translate contentKey="runboticsApp.activity.executionId">Execution Id</Translate>
                  </Label>
                  <AvInput id="activity-executionId" type="text" className="form-control" name="executionId" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="inputLabel" for="activity-input">
                  <Translate contentKey="runboticsApp.activity.input">Input</Translate>
                </Label>
                <AvInput id="activity-input" data-cy="input" type="textarea" name="input" />
              </AvGroup>
              <AvGroup>
                <Label id="outputLabel" for="activity-output">
                  <Translate contentKey="runboticsApp.activity.output">Output</Translate>
                </Label>
                <AvInput id="activity-output" data-cy="output" type="textarea" name="output" />
              </AvGroup>
              <AvGroup>
                <Label for="activity-processInstance">
                  <Translate contentKey="runboticsApp.activity.processInstance">Process Instance</Translate>
                </Label>
                <AvInput
                  id="activity-processInstance"
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
              <Button tag={Link} id="cancel-save" to="/activity" replace color="info">
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
  activityEntity: storeState.activity.entity,
  loading: storeState.activity.loading,
  updating: storeState.activity.updating,
  updateSuccess: storeState.activity.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(ActivityUpdate);
