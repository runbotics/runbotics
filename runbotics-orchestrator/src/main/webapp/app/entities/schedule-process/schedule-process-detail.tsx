import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './schedule-process.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IScheduleProcessDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ScheduleProcessDetail = (props: IScheduleProcessDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { scheduleProcessEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="scheduleProcessDetailsHeading">
          <Translate contentKey="runboticsApp.scheduleProcess.detail.title">ScheduleProcess</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{scheduleProcessEntity.id}</dd>
          <dt>
            <span id="cron">
              <Translate contentKey="runboticsApp.scheduleProcess.cron">Cron</Translate>
            </span>
          </dt>
          <dd>{scheduleProcessEntity.cron}</dd>
          <dt>
            <Translate contentKey="runboticsApp.scheduleProcess.process">Process</Translate>
          </dt>
          <dd>{scheduleProcessEntity.process ? scheduleProcessEntity.process.name : ''}</dd>
          <dt>
            <Translate contentKey="runboticsApp.scheduleProcess.bot">Bot</Translate>
          </dt>
          <dd>{scheduleProcessEntity.bot ? scheduleProcessEntity.bot.installationId : ''}</dd>
        </dl>
        <Button tag={Link} to="/schedule-process" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/schedule-process/${scheduleProcessEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ scheduleProcess }: IRootState) => ({
  scheduleProcessEntity: scheduleProcess.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleProcessDetail);
