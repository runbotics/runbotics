import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProcess } from 'app/shared/model/process.model';
import { getEntities as getProcesses } from 'app/entities/process/process.reducer';
import { IBot } from 'app/shared/model/bot.model';
import { getEntities as getBots } from 'app/entities/bot/bot.reducer';
import { getEntity, updateEntity, createEntity, reset } from './schedule-process.reducer';
import { IScheduleProcess } from 'app/shared/model/schedule-process.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IScheduleProcessUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ScheduleProcessUpdate = (props: IScheduleProcessUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { scheduleProcessEntity, processes, bots, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/schedule-process' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getProcesses();
    props.getBots();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...scheduleProcessEntity,
        ...values,
        process: processes.find(it => it.id.toString() === values.processId.toString()),
        bot: bots.find(it => it.id.toString() === values.botId.toString()),
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
          <h2 id="runboticsApp.scheduleProcess.home.createOrEditLabel" data-cy="ScheduleProcessCreateUpdateHeading">
            <Translate contentKey="runboticsApp.scheduleProcess.home.createOrEditLabel">Create or edit a ScheduleProcess</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : scheduleProcessEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="schedule-process-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="schedule-process-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="cronLabel" for="schedule-process-cron">
                  <Translate contentKey="runboticsApp.scheduleProcess.cron">Cron</Translate>
                </Label>
                <AvField
                  id="schedule-process-cron"
                  data-cy="cron"
                  type="text"
                  name="cron"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="schedule-process-process">
                  <Translate contentKey="runboticsApp.scheduleProcess.process">Process</Translate>
                </Label>
                <AvInput id="schedule-process-process" data-cy="process" type="select" className="form-control" name="processId" required>
                  <option value="" key="0" />
                  {processes
                    ? processes.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="schedule-process-bot">
                  <Translate contentKey="runboticsApp.scheduleProcess.bot">Bot</Translate>
                </Label>
                <AvInput id="schedule-process-bot" data-cy="bot" type="select" className="form-control" name="botId" required>
                  <option value="" key="0" />
                  {bots
                    ? bots.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.installationId}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/schedule-process" replace color="info">
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
  processes: storeState.process.entities,
  bots: storeState.bot.entities,
  scheduleProcessEntity: storeState.scheduleProcess.entity,
  loading: storeState.scheduleProcess.loading,
  updating: storeState.scheduleProcess.updating,
  updateSuccess: storeState.scheduleProcess.updateSuccess,
});

const mapDispatchToProps = {
  getProcesses,
  getBots,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleProcessUpdate);
