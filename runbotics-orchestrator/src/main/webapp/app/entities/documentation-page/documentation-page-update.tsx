import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { setFileData, byteSize, Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './documentation-page.reducer';
import { IDocumentationPage } from 'app/shared/model/documentation-page.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDocumentationPageUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DocumentationPageUpdate = (props: IDocumentationPageUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { documentationPageEntity, loading, updating } = props;

  const { content } = documentationPageEntity;

  const handleClose = () => {
    props.history.push('/documentation-page' + props.location.search);
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
        ...documentationPageEntity,
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
          <h2 id="runboticsApp.documentationPage.home.createOrEditLabel" data-cy="DocumentationPageCreateUpdateHeading">
            <Translate contentKey="runboticsApp.documentationPage.home.createOrEditLabel">Create or edit a DocumentationPage</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : documentationPageEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="documentation-page-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="documentation-page-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="documentation-page-title">
                  <Translate contentKey="runboticsApp.documentationPage.title">Title</Translate>
                </Label>
                <AvField id="documentation-page-title" data-cy="title" type="text" name="title" />
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="documentation-page-content">
                  <Translate contentKey="runboticsApp.documentationPage.content">Content</Translate>
                </Label>
                <AvInput id="documentation-page-content" data-cy="content" type="textarea" name="content" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/documentation-page" replace color="info">
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
  documentationPageEntity: storeState.documentationPage.entity,
  loading: storeState.documentationPage.loading,
  updating: storeState.documentationPage.updating,
  updateSuccess: storeState.documentationPage.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(DocumentationPageUpdate);
