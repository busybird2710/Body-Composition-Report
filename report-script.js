// Load wellness data and populate report
document.addEventListener('DOMContentLoaded', function() {
    loadReportData();
});

function loadReportData() {
    // Get data from sessionStorage
    const dataString = sessionStorage.getItem('wellnessData');
    
    if (!dataString) {
        alert('No wellness data found. Redirecting to form...');
        window.location.href = 'index.html';
        return;
    }
    
    const data = JSON.parse(dataString);
    
    // Populate person details
    document.getElementById('reportDate').textContent = formatDate(data.evaluationDate);
    document.getElementById('displayName').textContent = data.personName;
    document.getElementById('displayGender').textContent = capitalizeFirst(data.gender);
    document.getElementById('displayAge').textContent = data.age + ' years';
    document.getElementById('displayHeight').textContent = data.height + ' cm';
    document.getElementById('displayWeight').textContent = data.weight + ' kg';
    document.getElementById('displayEvalDate').textContent = formatDate(data.evaluationDate);
    
    // Populate biomarkers
    populateBiomarker('trunkFat', data.trunkFat, data.targetRanges.trunkFat, '%');
    populateBiomarker('muscleMass', data.skeletalMuscle, data.targetRanges.skeletalMuscle, '%');
    populateBiomarker('bodyFat', data.totalBodyFat, data.targetRanges.totalBodyFat, '%');
    populateBiomarker('visceralFat', data.visceralFat, data.targetRanges.visceralFat, '');
    populateBiomarker('bmi', data.bmi, data.targetRanges.bmi, ' kg/m²');
    
    // BMR (no target range)
    document.getElementById('bmrValue').textContent = data.bmr + ' kcal';
    
    // Populate biological age section
    document.getElementById('biologicalAge').textContent = data.biologicalAge;
    document.getElementById('chronologicalAge').textContent = data.age;
    
    const ageDiff = data.biologicalAge - parseInt(data.age);
    const ageDiffElement = document.getElementById('ageDifference');
    if (ageDiff > 0) {
        ageDiffElement.textContent = `${ageDiff} yrs older biologically`;
        ageDiffElement.style.color = '#dc3545';
    } else if (ageDiff < 0) {
        ageDiffElement.textContent = `${Math.abs(ageDiff)} yrs younger biologically`;
        ageDiffElement.style.color = '#28a745';
    } else {
        ageDiffElement.textContent = 'Biological age matches chronological age';
        ageDiffElement.style.color = '#28a745';
    }
    
    // Wellness index
    const wellnessScore = data.wellnessIndex;
    const wellnessCategory = getWellnessCategory(wellnessScore);
    
    document.getElementById('wellnessScore').textContent = wellnessScore;
    document.getElementById('wellnessCategory').textContent = wellnessCategory;
    
    // Animate wellness bar
    const wellnessFill = document.getElementById('wellnessFill');
    setTimeout(() => {
        wellnessFill.style.width = wellnessScore + '%';
    }, 500);
    
    // Generate coach remarks
    const remarks = generateCoachRemarks(data);
    document.getElementById('remarksContent').innerHTML = remarks;
    
    // Coach details
    document.getElementById('coachName').textContent = 'Coach ' + data.coachName;
    document.getElementById('footerCoach').textContent = data.coachName;
    document.getElementById('footerMobile').textContent = data.coachMobile;
    
    // Store data globally for action buttons
    window.reportData = data;
}

function populateBiomarker(prefix, value, target, unit) {
    const card = document.getElementById(prefix + 'Card');
    const valueElement = document.getElementById(prefix + 'Value');
    const targetElement = document.getElementById(prefix + 'Target');
    const deviationElement = document.getElementById(prefix + 'Deviation');
    const badge = card.querySelector('.status-badge');
    
    if (!value || value === 'null' || value === '') {
        valueElement.textContent = 'Not measured';
        targetElement.textContent = `${target.min} - ${target.max}${unit}`;
        deviationElement.textContent = '—';
        badge.textContent = 'NOT MEASURED';
        card.classList.remove('optimal');
        card.classList.add('monitor');
        badge.style.background = '#6c757d';
        return;
    }
    
    const val = parseFloat(value);
    valueElement.textContent = val.toFixed(1) + unit;
    targetElement.textContent = `${target.min} - ${target.max}${unit}`;
    
    // Calculate deviation
    let deviation = 0;
    let status = '';
    
    if (val < target.min) {
        deviation = val - target.min;
        status = 'ATTENTION';
        card.classList.remove('optimal', 'monitor');
    } else if (val > target.max) {
        deviation = val - target.max;
        status = 'ATTENTION';
        card.classList.remove('optimal', 'monitor');
    } else {
        deviation = 0;
        status = 'OPTIMAL';
        card.classList.remove('monitor');
        card.classList.add('optimal');
    }
    
    if (deviation !== 0) {
        const sign = deviation > 0 ? '+' : '';
        deviationElement.textContent = sign + deviation.toFixed(1) + unit;
        deviationElement.className = 'value deviation';
    } else {
        deviationElement.textContent = 'Within range';
        deviationElement.className = 'value deviation positive';
    }
    
    badge.textContent = status;
}

function getWellnessCategory(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Needs Attention';
    return 'Critical';
}

function generateCoachRemarks(data) {
    const ranges = data.targetRanges;
    let remarks = [];
    
    // Count parameters in range
    let inRange = 0;
    let total = 0;
    let issues = [];
    
    // Check each biomarker
    if (data.trunkFat) {
        total++;
        const val = parseFloat(data.trunkFat);
        if (val >= ranges.trunkFat.min && val <= ranges.trunkFat.max) {
            inRange++;
        } else {
            const deviation = val > ranges.trunkFat.max ? 
                (val - ranges.trunkFat.max).toFixed(1) : 
                (ranges.trunkFat.min - val).toFixed(1);
            issues.push(`TSF ${val.toFixed(1)}% (${val > ranges.trunkFat.max ? '+' : '-'}${deviation}% ${val > ranges.trunkFat.max ? 'above' : 'below'} target)`);
        }
    }
    
    if (data.skeletalMuscle) {
        total++;
        const val = parseFloat(data.skeletalMuscle);
        if (val >= ranges.skeletalMuscle.min && val <= ranges.skeletalMuscle.max) {
            inRange++;
        } else {
            const deviation = val < ranges.skeletalMuscle.min ? 
                (ranges.skeletalMuscle.min - val).toFixed(1) : 
                (val - ranges.skeletalMuscle.max).toFixed(1);
            issues.push(`Muscle mass ${val.toFixed(1)}% (${val < ranges.skeletalMuscle.min ? '-' : '+'}${deviation}% ${val < ranges.skeletalMuscle.min ? 'below' : 'above'} target)`);
        }
    }
    
    if (data.totalBodyFat) {
        total++;
        const val = parseFloat(data.totalBodyFat);
        if (val >= ranges.totalBodyFat.min && val <= ranges.totalBodyFat.max) {
            inRange++;
        } else {
            const deviation = val > ranges.totalBodyFat.max ? 
                (val - ranges.totalBodyFat.max).toFixed(1) : 
                (ranges.totalBodyFat.min - val).toFixed(1);
            issues.push(`Body fat ${val.toFixed(1)}% (${val > ranges.totalBodyFat.max ? '+' : '-'}${deviation}% ${val > ranges.totalBodyFat.max ? 'above' : 'below'} target)`);
        }
    }
    
    if (data.visceralFat) {
        total++;
        const val = parseFloat(data.visceralFat);
        if (val >= ranges.visceralFat.min && val <= ranges.visceralFat.max) {
            inRange++;
        } else {
            const deviation = val > ranges.visceralFat.max ? 
                (val - ranges.visceralFat.max).toFixed(1) : 
                (ranges.visceralFat.min - val).toFixed(1);
            issues.push(`Visceral fat ${val.toFixed(1)} (${val > ranges.visceralFat.max ? '+' : '-'}${deviation} ${val > ranges.visceralFat.max ? 'above' : 'below'} target)`);
        }
    }
    
    if (data.bmi) {
        total++;
        const val = parseFloat(data.bmi);
        if (val >= ranges.bmi.min && val <= ranges.bmi.max) {
            inRange++;
        } else {
            const deviation = val > ranges.bmi.max ? 
                (val - ranges.bmi.max).toFixed(1) : 
                (ranges.bmi.min - val).toFixed(1);
            issues.push(`BMI ${val.toFixed(1)} kg/m² (${val > ranges.bmi.max ? '+' : '-'}${deviation} kg/m² ${val > ranges.bmi.max ? 'above' : 'below'} target)`);
        }
    }
    
    // Generate opening statement
    let openingTone = '';
    if (inRange === total) {
        openingTone = 'excellent';
        remarks.push(`<p>This analysis indicates that <strong>${inRange} out of ${total} markers</strong> are currently within the target range. Excellent work! Your commitment to health is clearly reflected in these results. Continue your current regimen to maintain these optimal levels.</p>`);
    } else if (inRange >= total * 0.6) {
        openingTone = 'good';
        remarks.push(`<p>This analysis indicates that <strong>${inRange} out of ${total} markers</strong> are currently within the target range. This is a good foundation, but there's room for improvement in the remaining parameters to achieve optimal wellness.</p>`);
    } else if (inRange >= total * 0.3) {
        openingTone = 'attention';
        remarks.push(`<p>This analysis indicates that <strong>${inRange} out of ${total} markers</strong> are currently within the target range. Several parameters require attention and focused corrective intervention to prevent these imbalances from developing into more serious health concerns.</p>`);
    } else {
        openingTone = 'critical';
        remarks.push(`<p>This analysis indicates that <strong>${inRange} out of ${total} markers</strong> are currently within the target range. The findings reflect a critical window of opportunity — multiple parameters require immediate and sustained corrective intervention to prevent these imbalances from translating into serious long-term health conditions.</p>`);
    }
    
    // List issues if any
    if (issues.length > 0) {
        remarks.push(`<p><strong>Parameters requiring ${openingTone === 'critical' ? 'immediate' : ''} attention:</strong> ${issues.join(', ')}. These are the specific markers demanding focused corrective action.</p>`);
    }
    
    // Biological age remark
    const ageDiff = data.biologicalAge - parseInt(data.age);
    if (ageDiff > 5) {
        remarks.push(`<p>Notably, your biological age is currently <strong>${ageDiff} years ahead</strong> of your chronological age of ${data.age}, indicating that internal physiological aging is outpacing calendar years — this must be addressed with urgency.</p>`);
    } else if (ageDiff > 0) {
        remarks.push(`<p>Your biological age is <strong>${ageDiff} years ahead</strong> of your chronological age. While this is a moderate difference, focused lifestyle improvements can help reverse this trend.</p>`);
    } else if (ageDiff < 0) {
        remarks.push(`<p>Excellent news! Your biological age is <strong>${Math.abs(ageDiff)} years younger</strong> than your chronological age, indicating that your body is aging slower than the calendar suggests. Maintain your current healthy lifestyle.</p>`);
    }
    
    // Closing recommendations
    if (openingTone === 'critical' || openingTone === 'attention') {
        remarks.push(`<p>Every percentage point of improvement in these parameters carries real biological and clinical significance. Prioritise disciplined lifestyle, nutrition, consistent quality sleep, and a stable daily routine aligned with your circadian cycle. Your health is an ongoing investment, and the compounding returns of sustained effort are irreversible. The path to an exceptional wellness score is built one disciplined day at a time - commit fully and the results will follow.</p>`);
    } else {
        remarks.push(`<p>Continue your excellent work with consistent exercise, balanced nutrition, quality sleep, and stress management. Regular monitoring will help maintain these optimal levels and catch any early deviations before they become concerns.</p>`);
    }
    
    return remarks.join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Download report as PDF - Robust Implementation with Smart Page Breaks
async function downloadPDF() {
    const data = window.reportData;
    if (!data) {
        alert('Report data not found. Please generate the report first.');
        return;
    }

    // Show loading message
    const originalButton = document.querySelector('.pdf-btn');
    const originalText = originalButton.textContent;
    originalButton.disabled = true;
    originalButton.textContent = '⏳ Generating PDF...';

    try {
        // Check if libraries are loaded
        if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
            throw new Error('PDF libraries not loaded. Please check your internet connection and refresh the page.');
        }

        // Wait a moment for any animations to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Temporarily hide action buttons for cleaner PDF
        const actionSection = document.querySelector('.action-section');
        if (actionSection) actionSection.style.display = 'none';

        // Get all report sections marked for PDF
        const sections = document.querySelectorAll('.pdf-section');
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const margin = 10;
        const contentWidth = pageWidth - (2 * margin);
        
        let currentY = 0;
        let pageNumber = 1;

        // Process each section
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            
            // Capture this section as canvas
            const canvas = await html2canvas(section, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 1200
            });

            // Convert to image
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            
            // Calculate dimensions
            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Check if we need a new page
            if (currentY + imgHeight > pageHeight - margin) {
                // Section doesn't fit on current page
                
                if (imgHeight > pageHeight - (2 * margin)) {
                    // Section is too tall for one page - split it
                    let remainingHeight = imgHeight;
                    let sourceY = 0;
                    
                    while (remainingHeight > 0) {
                        const availableHeight = pageHeight - currentY - margin;
                        const heightToAdd = Math.min(availableHeight, remainingHeight);
                        
                        // Calculate source rectangle
                        const sourceHeight = (heightToAdd / imgWidth) * canvas.width;
                        
                        if (currentY > margin) {
                            // Add to current page
                            pdf.addImage(
                                imgData, 
                                'JPEG', 
                                margin, 
                                currentY, 
                                imgWidth, 
                                heightToAdd,
                                undefined,
                                'FAST',
                                0
                            );
                        }
                        
                        remainingHeight -= heightToAdd;
                        sourceY += sourceHeight;
                        
                        if (remainingHeight > 0) {
                            // Need new page
                            pdf.addPage();
                            pageNumber++;
                            currentY = margin;
                        } else {
                            currentY += heightToAdd;
                        }
                    }
                } else {
                    // Start this section on a new page
                    pdf.addPage();
                    pageNumber++;
                    currentY = margin;
                    
                    pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight);
                    currentY += imgHeight;
                }
            } else {
                // Section fits on current page
                pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight);
                currentY += imgHeight;
            }
            
            // Add small spacing between sections (unless footer)
            if (!section.classList.contains('report-footer') && i < sections.length - 1) {
                currentY += 5;
            }
        }

        // Restore action buttons
        if (actionSection) actionSection.style.display = '';

        // Generate filename
        const personName = data.personName.replace(/\s+/g, '_');
        const date = new Date().toISOString().split('T')[0];
        const filename = `VitalMetrics_Report_${personName}_${date}.pdf`;

        // Save the PDF
        pdf.save(filename);

        // Reset button
        originalButton.disabled = false;
        originalButton.textContent = originalText;

        // Show success message
        setTimeout(() => {
            alert('✅ PDF downloaded successfully!\n\nFilename: ' + filename + '\n\nPages: ' + pageNumber + '\n\nCheck your Downloads folder.');
        }, 300);

    } catch (error) {
        console.error('PDF generation error:', error);
        
        // Restore action buttons
        const actionSection = document.querySelector('.action-section');
        if (actionSection) actionSection.style.display = '';
        
        // Reset button
        originalButton.disabled = false;
        originalButton.textContent = originalText;
        
        // Show error with fallback option
        const useBackup = confirm('❌ Error generating PDF: ' + error.message + '\n\nWould you like to use the browser\'s Print-to-PDF instead?\n(This always works and is very reliable)');
        
        if (useBackup) {
            window.print();
        }
    }
}

// Alternative: Simple print-to-PDF function (always works)
function printToPDF() {
    // Hide action buttons before printing
    const actionSection = document.querySelector('.action-section');
    if (actionSection) {
        actionSection.style.display = 'none';
    }
    
    // Trigger print dialog
    window.print();
    
    // Restore action buttons after print dialog closes
    setTimeout(() => {
        if (actionSection) {
            actionSection.style.display = '';
        }
    }, 1000);
}

// Action button functions
function sendToWhatsApp() {
    const data = window.reportData;
    if (!data) return;
    
    const message = encodeURIComponent(
        `🏥 *VitalMetrics Pro - Wellness Report*\n\n` +
        `Hello ${data.personName}!\n\n` +
        `Your comprehensive body composition analysis is complete:\n\n` +
        `📊 *Key Findings:*\n` +
        `• Biological Age: ${data.biologicalAge} years\n` +
        `• Chronological Age: ${data.age} years\n` +
        `• Wellness Index: ${data.wellnessIndex}/100\n` +
        `• BMI: ${data.bmi} kg/m²\n\n` +
        `For detailed analysis and recommendations, please review your complete report.\n\n` +
        `Coach: ${data.coachName}\n` +
        `📱 ${data.coachMobile}`
    );
    
    const phoneNumber = data.mobileNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

function sendToEmail() {
    const data = window.reportData;
    if (!data) return;
    
    const subject = encodeURIComponent('Your VitalMetrics Pro Wellness Report');
    const body = encodeURIComponent(
        `Dear ${data.personName},\n\n` +
        `Your comprehensive wellness and body composition analysis has been completed.\n\n` +
        `KEY FINDINGS:\n` +
        `• Biological Age: ${data.biologicalAge} years (Chronological: ${data.age} years)\n` +
        `• Overall Wellness Index: ${data.wellnessIndex}/100\n` +
        `• BMI: ${data.bmi} kg/m²\n` +
        `• BMR: ${data.bmr} kcal\n\n` +
        `Please review your complete report for detailed analysis, target ranges, and personalized recommendations.\n\n` +
        `For any questions or to schedule a consultation, please contact:\n` +
        `Coach ${data.coachName}\n` +
        `Mobile: ${data.coachMobile}\n\n` +
        `Best regards,\n` +
        `VitalMetrics Pro Team\n\n` +
        `---\n` +
        `This report is confidential and intended solely for the person named above.`
    );
    
    window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
}
