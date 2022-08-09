import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { byteSize, Translate, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './process-instance.reducer';
import { IProcessInstance } from 'app/shared/model/process-instance.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IProcessInstanceProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const ProcessInstance = (props: IProcessInstanceProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const { processInstanceList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="process-instance-heading" data-cy="ProcessInstanceHeading">
        <Translate contentKey="runboticsApp.processInstance.home.title">Process Instances</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="runboticsApp.processInstance.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="runboticsApp.processInstance.home.createLabel">Create new Process Instance</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {processInstanceList && processInstanceList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="runboticsApp.processInstance.id">Id</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('orchestratorProcessInstanceId')}>
                  <Translate contentKey="runboticsApp.processInstance.orchestratorProcessInstanceId">
                    Orchestrator Process Instance Id
                  </Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="runboticsApp.processInstance.status">Status</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('created')}>
                  <Translate contentKey="runboticsApp.processInstance.created">Created</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('updated')}>
                  <Translate contentKey="runboticsApp.processInstance.updated">Updated</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('input')}>
                  <Translate contentKey="runboticsApp.processInstance.input">Input</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('output')}>
                  <Translate contentKey="runboticsApp.processInstance.output">Output</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('step')}>
                  <Translate contentKey="runboticsApp.processInstance.step">Step</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="runboticsApp.processInstance.process">Process</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="runboticsApp.processInstance.bot">Bot</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {processInstanceList.map((processInstance, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${processInstance.id}`} color="link" size="sm">
                      {processInstance.id}
                    </Button>
                  </td>
                  <td>{processInstance.id}</td>
                  <td>{processInstance.orchestratorProcessInstanceId}</td>
                  <td>{processInstance.status}</td>
                  <td>
                    {processInstance.created ? <TextFormat type="date" value={processInstance.created} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {processInstance.updated ? <TextFormat type="date" value={processInstance.updated} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{processInstance.input}</td>
                  <td>{processInstance.output}</td>
                  <td>{processInstance.step}</td>
                  <td>
                    {processInstance.process ? (
                      <Link to={`process/${processInstance.process.id}`}>{processInstance.process.name}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {processInstance.bot ? <Link to={`bot/${processInstance.bot.id}`}>{processInstance.bot.installationId}</Link> : ''}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${processInstance.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${processInstance.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${processInstance.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="runboticsApp.processInstance.home.notFound">No Process Instances found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={processInstanceList && processInstanceList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={props.totalItems}
            />
          </Row>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const mapStateToProps = ({ processInstance }: IRootState) => ({
  processInstanceList: processInstance.entities,
  loading: processInstance.loading,
  totalItems: processInstance.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessInstance);
