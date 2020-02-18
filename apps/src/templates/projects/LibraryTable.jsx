import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import i18n from '@cdo/locale';
import color from '@cdo/apps/util/color';
import orderBy from 'lodash/orderBy';
import * as Table from 'reactabular-table';
import * as sort from 'sortabular';
import wrappedSortable from '../tables/wrapped_sortable';
import {tableLayoutStyles, sortableOptions} from '../tables/tableConstants';
import {getProjectLibraries} from './projectsRedux';
import PersonalProjectsNameCell from './PersonalProjectsNameCell';

export const COLUMNS = {
  LIBRARY_NAME: 0,
  PROJECT_NAME: 1,
  DESCRIPTION: 2,
  PUBLISHED: 3,
  LAST_PUBLISHED: 4
};

const styles = {
  headerCellName: {
    borderWidth: '0px 1px 1px 0px',
    borderColor: color.border_light_gray,
    padding: 15
  },
  cellName: {
    borderWidth: '1px 1px 1px 0px',
    borderColor: color.border_light_gray,
    padding: 15,
    width: 250
  }
};

const projectNameFormatter = (name, {rowData}) => {
  return (
    <PersonalProjectsNameCell
      id={rowData.id}
      projectId={rowData.channel}
      projectType={rowData.type}
      projectName={name}
      isEditing={rowData.isEditing}
    />
  );
};

class LibraryTable extends React.Component {
  static propTypes = {
    // Provided by Redux
    libraries: PropTypes.array.isRequired // TODO: ADD SHAPE
  };

  state = {
    sortingColumns: {
      [COLUMNS.LAST_PUBLISHED]: {
        direction: 'desc',
        position: 0
      }
    }
  };

  getSortingColumns = () => {
    return this.state.sortingColumns || {};
  };

  onSort = selectedColumn => {
    this.setState({
      sortingColumns: sort.byColumn({
        sortingColumns: this.state.sortingColumns,
        // Custom sortingOrder removes 'no-sort' from the cycle
        sortingOrder: {
          FIRST: 'asc',
          asc: 'desc',
          desc: 'asc'
        },
        selectedColumn
      })
    });
  };

  getColumns = sortable => {
    return [
      {
        property: 'libraryName',
        header: {
          label: i18n.libraryName(),
          props: {
            style: {
              ...tableLayoutStyles.headerCell,
              ...styles.headerCellName
            }
          },
          transforms: [sortable]
        },
        cell: {
          props: {
            style: {
              ...tableLayoutStyles.cell,
              ...styles.cellName
            }
          }
        }
      },
      {
        property: 'name',
        header: {
          label: i18n.projectName(),
          props: {
            style: {
              ...tableLayoutStyles.headerCell,
              ...styles.headerCellName
            }
          },
          transforms: [sortable]
        },
        cell: {
          formatters: [projectNameFormatter],
          props: {
            style: {
              ...tableLayoutStyles.cell,
              ...styles.cellName
            }
          }
        }
      },
      {
        property: 'libraryDescription',
        header: {
          label: i18n.description(),
          props: {
            style: {
              ...tableLayoutStyles.headerCell,
              ...styles.headerCellName
            }
          },
          transforms: [sortable]
        },
        cell: {
          props: {
            style: {
              ...tableLayoutStyles.cell,
              ...styles.cellName
            }
          }
        }
      }
    ];
  };

  render() {
    // Define a sorting transform that can be applied to each column
    const sortable = wrappedSortable(
      this.getSortingColumns,
      this.onSort,
      sortableOptions
    );
    const columns = this.getColumns(sortable);
    const sortingColumns = this.getSortingColumns();
    const sortedRows = sort.sorter({
      columns,
      sortingColumns,
      sort: orderBy
    })(this.props.libraries);

    // TODO: display message if no libraries
    return (
      <Table.Provider columns={columns} style={tableLayoutStyles.table}>
        <Table.Header />
        <Table.Body rows={sortedRows} rowKey="channel" />
      </Table.Provider>
    );
  }
}

export const UnconnectedLibraryTable = LibraryTable;

export default connect(state => ({
  libraries: getProjectLibraries(state)
}))(LibraryTable);
