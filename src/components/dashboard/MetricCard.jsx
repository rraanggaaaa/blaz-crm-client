import React from 'react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const MetricCard = ({ title, value, trend, trendValue, color = 'default' }) => {
    const colors = {
        default: 'text-[#E6EDF3]',
        green: 'text-[#00C853]',
        blue: 'text-[#58A6FF]',
        yellow: 'text-[#FFBD2E]'
    };

    const formatValue = (val) => {
        if (typeof val === 'number') {
            if (val > 1000000) return formatCurrency(val);
            if (val > 1000) return formatNumber(val);
            return val;
        }
        return val;
    };

    const getTrendIcon = () => {
        if (trend === 'up') return '↑';
        if (trend === 'down') return '↓';
        return '→';
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'text-[#00C853]';
        if (trend === 'down') return 'text-[#FF5F57]';
        return 'text-[#7D8590]';
    };

    return (
        <div className="bg-[#161B22] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5">
            <div className={`text-[28px] font-extrabold leading-none ${colors[color]}`}>
                {formatValue(value)}
            </div>
            <div className="text-xs text-[#7D8590] mt-1.5">{title}</div>
            {trend && (
                <div className={`text-[11px] mt-1 ${getTrendColor()}`}>
                    {getTrendIcon()} {trendValue}
                </div>
            )}
        </div>
    );
};

export default MetricCard;