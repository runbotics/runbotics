import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './documentation-page.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDocumentationPageDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const DocumentationPageDetail = (props: IDocumentationPageDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { documentationPageEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="documentationPageDetailsHeading">
          <Translate contentKey="runboticsApp.documentationPage.detail.title">DocumentationPage</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{documentationPageEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="runboticsApp.documentationPage.title">Title</Translate>
            </span>
          </dt>
          <dd>{documentationPageEntity.title}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="runboticsApp.documentationPage.content">Content</Translate>
            </span>
          </dt>
          <dd>{documentationPageEntity.content}</dd>
        </dl>
        <Button tag={Link} to="/documentation-page" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/documentation-page/${documentationPageEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ documentationPage }: IRootState) => ({
  documentationPageEntity: documentationPage.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DocumentationPageDetail);
