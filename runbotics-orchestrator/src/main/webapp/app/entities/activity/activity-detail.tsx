import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './activity.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IActivityDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ActivityDetail = (props: IActivityDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { activityEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="activityDetailsHeading">
          <Translate contentKey="runboticsApp.activity.detail.title">Activity</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="executionId">
              <Translate contentKey="runboticsApp.activity.executionId">Execution Id</Translate>
            </span>
          </dt>
          <dd>{activityEntity.executionId}</dd>
          <dt>
            <span id="input">
              <Translate contentKey="runboticsApp.activity.input">Input</Translate>
            </span>
          </dt>
          <dd>{activityEntity.input}</dd>
          <dt>
            <span id="output">
              <Translate contentKey="runboticsApp.activity.output">Output</Translate>
            </span>
          </dt>
          <dd>{activityEntity.output}</dd>
          <dt>
            <Translate contentKey="runboticsApp.activity.processInstance">Process Instance</Translate>
          </dt>
          <dd>{activityEntity.processInstance ? activityEntity.processInstance.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/activity" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/activity/${activityEntity.executionId}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ activity }: IRootState) => ({
  activityEntity: activity.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetail);
