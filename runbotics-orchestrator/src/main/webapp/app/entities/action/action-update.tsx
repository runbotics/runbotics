import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { setFileData, byteSize, Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './action.reducer';
import { IAction } from 'app/shared/model/action.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IActionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ActionUpdate = (props: IActionUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { actionEntity, loading, updating } = props;

  const { form } = actionEntity;

  const handleClose = () => {
    props.history.push('/action' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
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
        ...actionEntity,
        ...values,
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
          <h2 id="runboticsApp.action.home.createOrEditLabel" data-cy="ActionCreateUpdateHeading">
            <Translate contentKey="runboticsApp.action.home.createOrEditLabel">Create or edit a Action</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : actionEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="action-id">
                    <Translate contentKey="runboticsApp.action.id">Id</Translate>
                  </Label>
                  <AvInput id="action-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="labelLabel" for="action-label">
                  <Translate contentKey="runboticsApp.action.label">Label</Translate>
                </Label>
                <AvField id="action-label" data-cy="label" type="text" name="label" />
              </AvGroup>
              <AvGroup>
                <Label id="scriptLabel" for="action-script">
                  <Translate contentKey="runboticsApp.action.script">Script</Translate>
                </Label>
                <AvField id="action-script" data-cy="script" type="text" name="script" />
              </AvGroup>
              <AvGroup>
                <Label id="formLabel" for="action-form">
                  <Translate contentKey="runboticsApp.action.form">Form</Translate>
                </Label>
                <AvInput id="action-form" data-cy="form" type="textarea" name="form" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/action" replace color="info">
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
  actionEntity: storeState.action.entity,
  loading: storeState.action.loading,
  updating: storeState.action.updating,
  updateSuccess: storeState.action.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ActionUpdate);
