import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { desktopOS, valueFormatter } from './chartDetails';
import PieChartWithCustomizedLabel from './PieChart'

export default function PieActiveArc() {
    return (

        <>


            <div className="container">
                <div className="row">
                    <div className="col-md-6 d-flex justify-content-center">
                        <PieChartWithCustomizedLabel />

                    </div>
                    <div className="col-md-6">

                        <PieChart
                            series={[
                                {
                                    data: desktopOS,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    valueFormatter,
                                },
                            ]}
                            height={200}
                        />

                    </div>
                </div>
            </div>

        </>
    );
}