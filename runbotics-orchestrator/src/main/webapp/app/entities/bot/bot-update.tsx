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
import { getEntity, updateEntity, createEntity, reset } from './bot.reducer';
import { IBot } from 'app/shared/model/bot.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IBotUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BotUpdate = (props: IBotUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { botEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/bot' + props.location.search);
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
    values.created = convertDateTimeToServer(values.created);
    values.lastConnected = convertDateTimeToServer(values.lastConnected);

    if (errors.length === 0) {
      const entity = {
        ...botEntity,
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
          <h2 id="runboticsApp.bot.home.createOrEditLabel" data-cy="BotCreateUpdateHeading">
            <Translate contentKey="runboticsApp.bot.home.createOrEditLabel">Create or edit a Bot</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : botEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="bot-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="bot-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="installationIdLabel" for="bot-installationId">
                  <Translate contentKey="runboticsApp.bot.installationId">Installation Id</Translate>
                </Label>
                <AvField
                  id="bot-installationId"
                  data-cy="installationId"
                  type="text"
                  name="installationId"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdLabel" for="bot-created">
                  <Translate contentKey="runboticsApp.bot.created">Created</Translate>
                </Label>
                <AvInput
                  id="bot-created"
                  data-cy="created"
                  type="datetime-local"
                  className="form-control"
                  name="created"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.botEntity.created)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="lastConnectedLabel" for="bot-lastConnected">
                  <Translate contentKey="runboticsApp.bot.lastConnected">Last Connected</Translate>
                </Label>
                <AvInput
                  id="bot-lastConnected"
                  data-cy="lastConnected"
                  type="datetime-local"
                  className="form-control"
                  name="lastConnected"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.botEntity.lastConnected)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="bot-user">
                  <Translate contentKey="runboticsApp.bot.user">User</Translate>
                </Label>
                <AvInput id="bot-user" data-cy="user" type="select" className="form-control" name="userId">
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
              <Button tag={Link} id="cancel-save" to="/bot" replace color="info">
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
  botEntity: storeState.bot.entity,
  loading: storeState.bot.loading,
  updating: storeState.bot.updating,
  updateSuccess: storeState.bot.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(BotUpdate);
