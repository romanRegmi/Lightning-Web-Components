// JS File - chartComponent.js
import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import CHARTJS from '@salesforce/resourceUrl/ChartJs';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class ChartComponent extends LightningElement {
    chartJsInitialized = false;
 
    renderedCallback() {
        if (this.chartJsInitialized) {
            return;
        }
        this.chartJsInitialized = true;
 
        loadScript(this, CHARTJS)
            .then(() => {
                this.initializeChart();
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Error loading Chart.js library',
                    variant: 'error'
                }));
            });
    }
 
    initializeChart() {
        const ctx = this.template.querySelector('canvas.donut').getContext('2d');
        new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May'],
                datasets: [{
                    label: 'Sales',
                    data: [50, 30, 60, 40, 70],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}