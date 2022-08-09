import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './bot.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBotDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BotDetail = (props: IBotDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { botEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="botDetailsHeading">
          <Translate contentKey="runboticsApp.bot.detail.title">Bot</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{botEntity.id}</dd>
          <dt>
            <span id="installationId">
              <Translate contentKey="runboticsApp.bot.installationId">Installation Id</Translate>
            </span>
          </dt>
          <dd>{botEntity.installationId}</dd>
          <dt>
            <span id="created">
              <Translate contentKey="runboticsApp.bot.created">Created</Translate>
            </span>
          </dt>
          <dd>{botEntity.created ? <TextFormat value={botEntity.created} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="lastConnected">
              <Translate contentKey="runboticsApp.bot.lastConnected">Last Connected</Translate>
            </span>
          </dt>
          <dd>{botEntity.lastConnected ? <TextFormat value={botEntity.lastConnected} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="runboticsApp.bot.user">User</Translate>
          </dt>
          <dd>{botEntity.user ? botEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/bot" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/bot/${botEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ bot }: IRootState) => ({
  botEntity: bot.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BotDetail);
