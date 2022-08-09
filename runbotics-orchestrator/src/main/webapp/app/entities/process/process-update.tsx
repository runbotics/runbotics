import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { setFileData, byteSize, Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './process.reducer';
import { IProcess } from 'app/shared/model/process.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProcessUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessUpdate = (props: IProcessUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { processEntity, users, loading, updating } = props;

  const { description, definition } = processEntity;

  const handleClose = () => {
    props.history.push('/process' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
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
        ...processEntity,
        ...values,
        createdBy: users.find(it => it.id.toString() === values.createdById.toString()),
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
          <h2 id="runboticsApp.process.home.createOrEditLabel" data-cy="ProcessCreateUpdateHeading">
            <Translate contentKey="runboticsApp.process.home.createOrEditLabel">Create or edit a Process</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : processEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="process-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="process-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="process-name">
                  <Translate contentKey="runboticsApp.process.name">Name</Translate>
                </Label>
                <AvField
                  id="process-name"
                  data-cy="name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="process-description">
                  <Translate contentKey="runboticsApp.process.description">Description</Translate>
                </Label>
                <AvInput id="process-description" data-cy="description" type="textarea" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="definitionLabel" for="process-definition">
                  <Translate contentKey="runboticsApp.process.definition">Definition</Translate>
                </Label>
                <AvInput id="process-definition" data-cy="definition" type="textarea" name="definition" />
              </AvGroup>
              <AvGroup check>
                <Label id="isPublicLabel">
                  <AvInput id="process-isPublic" data-cy="isPublic" type="checkbox" className="form-check-input" name="isPublic" />
                  <Translate contentKey="runboticsApp.process.isPublic">Is Public</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="createdLabel" for="process-created">
                  <Translate contentKey="runboticsApp.process.created">Created</Translate>
                </Label>
                <AvInput
                  id="process-created"
                  data-cy="created"
                  type="datetime-local"
                  className="form-control"
                  name="created"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processEntity.created)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="updatedLabel" for="process-updated">
                  <Translate contentKey="runboticsApp.process.updated">Updated</Translate>
                </Label>
                <AvInput
                  id="process-updated"
                  data-cy="updated"
                  type="datetime-local"
                  className="form-control"
                  name="updated"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processEntity.updated)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="executionsCountLabel" for="process-executionsCount">
                  <Translate contentKey="runboticsApp.process.executionsCount">Executions Count</Translate>
                </Label>
                <AvField
                  id="process-executionsCount"
                  data-cy="executionsCount"
                  type="string"
                  className="form-control"
                  name="executionsCount"
                />
              </AvGroup>
              <AvGroup>
                <Label id="successExecutionsCountLabel" for="process-successExecutionsCount">
                  <Translate contentKey="runboticsApp.process.successExecutionsCount">Success Executions Count</Translate>
                </Label>
                <AvField
                  id="process-successExecutionsCount"
                  data-cy="successExecutionsCount"
                  type="string"
                  className="form-control"
                  name="successExecutionsCount"
                />
              </AvGroup>
              <AvGroup>
                <Label id="failureExecutionsCountLabel" for="process-failureExecutionsCount">
                  <Translate contentKey="runboticsApp.process.failureExecutionsCount">Failure Executions Count</Translate>
                </Label>
                <AvField
                  id="process-failureExecutionsCount"
                  data-cy="failureExecutionsCount"
                  type="string"
                  className="form-control"
                  name="failureExecutionsCount"
                />
              </AvGroup>
              <AvGroup>
                <Label for="process-createdBy">
                  <Translate contentKey="runboticsApp.process.createdBy">Created By</Translate>
                </Label>
                <AvInput id="process-createdBy" data-cy="createdBy" type="select" className="form-control" name="createdById">
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/process" replace color="info">
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
  users: storeState.userManagement.users,
  processEntity: storeState.process.entity,
  loading: storeState.process.loading,
  updating: storeState.process.updating,
  updateSuccess: storeState.process.updateSuccess,
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessUpdate);
