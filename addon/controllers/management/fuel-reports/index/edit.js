import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ManagementFuelReportsIndexEditController extends Controller {
    /**
     * Inject the `hostRouter` service
     *
     * @memberof ManagementDriversIndexEditController
     */
    @service hostRouter;

    /**
     * Inject the `hostRouter` service
     *
     * @memberof ManagementDriversIndexEditController
     */
    @service modalsManager;

    /**
     * The overlay component context.
     *
     * @memberof ManagementDriversIndexEditController
     */
    @tracked overlay;

    /**
     * When exiting the overlay.
     *
     * @return {Transition}
     * @memberof ManagementDriversIndexEditController
     */
    @action transitionBack(fuelReport) {
        // check if fuel-report record has been edited and prompt for confirmation
        if (fuelReport.hasDirtyAttributes) {
            return this.confirmContinueWithUnsavedChanges(fuelReport, {
                confirm: () => {
                    fuelReport.rollbackAttributes();
                    return this.transitionToRoute('management.fuel-reports.index');
                },
            });
        }

        return this.transitionToRoute('management.fuel-reports.index');
    }

    /**
     * Set the overlay component context object.
     *
     * @param {OverlayContext} overlay
     * @memberof ManagementDriversIndexEditController
     */
    @action setOverlayContext(overlay) {
        this.overlay = overlay;
    }

    /**
     * When driver details button is clicked in overlay.
     *
     * @param {VehicleModel} driver
     * @return {Promise}
     * @memberof ManagementDriversIndexEditController
     */
    @action onViewDetails(fuelReport) {
        // check if fuel-report record has been edited and prompt for confirmation
        if (fuelReport.hasDirtyAttributes) {
            return this.confirmContinueWithUnsavedChanges(fuelReport);
        }

        return this.transitionToRoute('management.fuel-reports.index.details', fuelReport);
    }

    /**
     * Trigger a route refresh and focus the new driver created.
     *
     * @param {VehicleModel} driver
     * @return {Promise}
     * @memberof ManagementDriversIndexEditController
     */
    @action onAfterSave(fuelReport) {
        if (this.overlay) {
            this.overlay.close();
        }

        this.hostRouter.refresh();
        return this.transitionToRoute('management.fuel-reports.index.details', fuelReport);
    }

    /**
     * Prompts the user to confirm if they wish to continue with unsaved changes.
     *
     * @method
     * @param {VehicleModel} driver - The driver object with unsaved changes.
     * @param {Object} [options={}] - Additional options for configuring the modal.
     * @returns {Promise} A promise that resolves when the user confirms, and transitions to a new route.
     * @memberof ManagementDriversIndexEditController
     */
    confirmContinueWithUnsavedChanges(fuelReport, options = {}) {
        return this.modalsManager.confirm({
            title: 'Continue Without Saving?',
            body: 'Unsaved changes to this fuel report will be lost. Click continue to proceed.',
            acceptButtonText: 'Continue without saving',
            confirm: () => {
                fuelReport.rollbackAttributes();
                return this.transitionToRoute('management.fuel-reports.index.details', fuelReport);
            },
            ...options,
        });
    }
}
