import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getTimes, timeToString } from '../../utils/index';
import { images } from '../../assets';
import SearchTabView from './SearchTabView';
import { RelativeOpeningTime } from '../listing/RelativeOpeningTime';

// TODO: create a shared component for Resource and Service entries
class ServiceEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      openUntil: null,
    };

    this.getOpenInformation = this.getOpenInformation.bind(this);
  }
  componentDidMount() {
    this.getOpenInformation(this.props.hit.schedule);
  }

  getOpenInformation(scheduleDays) {
    const openInfo = getTimes(scheduleDays);
    this.setState({
      isOpen: openInfo.isOpen,
      openUntil: openInfo.openUntil,
      is24hour: openInfo.is24hour,
    });
  }

  render() {
    const { hit, index } = this.props;
    const description = hit.long_description || 'No description, yet...';
    const applicationProcess = hit.application_process;
    const schedule = hit.schedule ? { schedule_days: hit.schedule } : hit.resource_schedule;

    return (
      <li className="results-table-entry service-entry">
        <header>
          <div className="entry-details">
            <h4 className="entry-headline"><Link to={{ pathname: `/services/${hit.service_id}` }}>{`${index + 1}.) ${hit.name}`}</Link></h4>
            <div className="entry-subhead">
              <p className="entry-affiliated-resource">a service offered by <Link to={{ pathname: '/resource', query: { id: hit.resource_id } }}>{hit.service_of}</Link></p>
              <p>
                { hit.addresses && hit.addresses.address_1 ? hit.addresses.address_1 : 'No address found' }
                {/* { schedule ? ' • ' : null } */}
                { schedule ? <span className="float-right"><RelativeOpeningTime schedule={schedule} /></span> : null }
              </p>
            </div>
          </div>
          {hit.is_mohcd_funded ?
            <div className="mohcd-funded">
              <img src={images.mohcdSeal} alt="MOHCD seal" />
              <p>Funded by MOHCD</p>
            </div>
            :
            null
          }
        </header>
        <div className="line-break" />

        <SearchTabView applicationProcess={applicationProcess} description={description} schedule={hit.schedule} />

        <div className="entry-action-buttons">
          <ul className="action-buttons">
            <li className="action-button"><Link to={{ pathname: `/services/${hit.service_id}` }}>Details</Link></li>
            <li className="action-button">
              <a
                href={`https://maps.google.com?saddr=Current+Location&daddr=${hit._geoloc ? hit._geoloc.lat : 0},${hit._geoloc ? hit._geoloc.lng : 0}&dirflg=w`}
                target="_blank"
                rel="noopener noreferrer"
              >
                  Directions
              </a>
            </li>
          </ul>
        </div>

      </li>
    );
  }
}


function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}

export default connect(mapStateToProps)(ServiceEntry);
