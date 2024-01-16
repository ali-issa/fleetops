import OperationsServiceRatesIndexNewController from './new';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class OperationsServiceRatesIndexEditController extends OperationsServiceRatesIndexNewController {
    
    /**
     * Inject the `intl` service
     *
     * @var {Service}
     */
    @service intl;
    
    
    /**
     * True if updating service rate.
     *
     * @var {Boolean}
     */
    @tracked isUpdatingServiceRate = false;

    // @alias('@model.rate_fees') rateFees;
    // @alias('@model.parcel_fees') parcelFees;

    /**
     * Updates the service rate to server
     *
     * @void
     */
    @action updateServiceRate() {
        const { serviceRate, rateFees, perDropRateFees, parcelFees } = this;

        if (serviceRate.isFixedMeter) {
            serviceRate.setServiceRateFees(rateFees);
        }

        if (serviceRate.isPerDrop) {
            serviceRate.setServiceRateFees(perDropRateFees);
        }

        if (serviceRate.isParcelService) {
            serviceRate.setServiceRateParcelFees(parcelFees);
        }

        this.isUpdatingServiceRate = true;
        this.loader.showLoader('.overlay-inner-content', { loadingMessage: 'Updating service rate...' });

        return serviceRate
            .save()
            .then((serviceRate) => {
                return this.transitionToRoute('operations.service-rates.index').then(() => {
                    this.notifications.success(this.intl.t('fleet-ops.controllers.operations.service-rates.index.edit.success-message', {serviceName: serviceRate.service_name}));
                    this.resetForm();
                });
            })
            .catch(this.notifications.serverError)
            .finally(() => {
                this.isUpdatingServiceRate = false;
                this.loader.removeLoader();
            });
    }
}
