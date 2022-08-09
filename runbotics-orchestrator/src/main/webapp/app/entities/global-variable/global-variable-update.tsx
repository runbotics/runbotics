import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './global-variable.reducer';
import { IGlobalVariable } from 'app/shared/model/global-variable.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IGlobalVariableUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const GlobalVariableUpdate = (props: IGlobalVariableUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { globalVariableEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/global-variable' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.lastModified = convertDateTimeToServer(values.lastModified);

    if (errors.length === 0) {
      const entity = {
        ...globalVariableEntity,
        ...values,
        user: users.find(it => it.id.toString() === values.userId.toString()),
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
          <h2 id="runboticsApp.globalVariable.home.createOrEditLabel" data-cy="GlobalVariableCreateUpdateHeading">
            <Translate contentKey="runboticsApp.globalVariable.home.createOrEditLabel">Create or edit a GlobalVariable</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : globalVariableEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="global-variable-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="global-variable-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="global-variable-name">
                  <Translate contentKey="runboticsApp.globalVariable.name">Name</Translate>
                </Label>
                <AvField id="global-variable-name" data-cy="name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="global-variable-description">
                  <Translate contentKey="runboticsApp.globalVariable.description">Description</Translate>
                </Label>
                <AvField id="global-variable-description" data-cy="description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="global-variable-type">
                  <Translate contentKey="runboticsApp.globalVariable.type">Type</Translate>
                </Label>
                <AvField id="global-variable-type" data-cy="type" type="text" name="type" />
              </AvGroup>
              <AvGroup>
                <Label id="valueLabel" for="global-variable-value">
                  <Translate contentKey="runboticsApp.globalVariable.value">Value</Translate>
                </Label>
                <AvField id="global-variable-value" data-cy="value" type="text" name="value" />
              </AvGroup>
              <AvGroup>
                <Label id="lastModifiedLabel" for="global-variable-lastModified">
                  <Translate contentKey="runboticsApp.globalVariable.lastModified">Last Modified</Translate>
                </Label>
                <AvInput
                  id="global-variable-lastModified"
                  data-cy="lastModified"
                  type="datetime-local"
                  className="form-control"
                  name="lastModified"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.globalVariableEntity.lastModified)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="global-variable-user">
                  <Translate contentKey="runboticsApp.globalVariable.user">User</Translate>
                </Label>
                <AvInput id="global-variable-user" data-cy="user" type="select" className="form-control" name="userId">
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
              <Button tag={Link} id="cancel-save" to="/global-variable" replace color="info">
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
  globalVariableEntity: storeState.globalVariable.entity,
  loading: storeState.globalVariable.loading,
  updating: storeState.globalVariable.updating,
  updateSuccess: storeState.globalVariable.updateSuccess,
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(GlobalVariableUpdate);
