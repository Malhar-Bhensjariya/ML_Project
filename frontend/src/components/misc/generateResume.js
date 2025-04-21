import { jsPDF } from "jspdf";
import { format } from 'date-fns';

export default function generateResume(menteeData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20; // Increased margin for better spacing
    let y = margin;
    
    const { 
        user, 
        academics, 
        futureGoals, 
        progress, 
        internships, 
        achievements, 
        extracurricular, 
        preferences 
    } = menteeData;

    // Add custom fonts
    doc.setFont("helvetica");
    
    // Modern Header Section with gradient
    const headerHeight = 45; // Increased header height
    doc.setFillColor(41, 65, 122); // Professional dark blue base
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    // Subtle header accent
    doc.setFillColor(55, 89, 150); // Lighter blue accent
    doc.rect(0, headerHeight - 5, pageWidth, 5, 'F');
    
    // Name - Larger and better positioned
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(user.name, margin, headerHeight/2 + 2);
    
    // Contact Info - Better aligned and spaced
    doc.setFontSize(10);
    doc.setTextColor(220, 220, 220);
    const contactInfo = [
        `Email: ${user.email}`,
        `Phone: ${user.phone || 'Not specified'}`,
        `Location: ${user.location || 'Not specified'}`
    ];
    doc.text(contactInfo, pageWidth - margin, headerHeight/2, { align: 'right' });
    
    // Reset styling and move down past header
    y = headerHeight + 15;
    doc.setTextColor(50, 50, 50); // Darker text for better readability
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    // Professional Summary (if available)
    if (user.bio) {
        addSectionHeader(doc, 'Professional Summary', margin, y);
        y += 10;
        doc.setFontSize(10);
        const wrappedText = doc.splitTextToSize(user.bio, pageWidth - (margin * 2));
        doc.text(wrappedText, margin, y);
        y += wrappedText.length * 5 + 10;
    }

    // Education Section
    addSectionHeader(doc, 'Education', margin, y);
    y += 12; // More space after section header
    
    const educations = [
        {
            degree: 'Class 10',
            institution: academics?.class10?.school,
            details: `${academics?.class10?.percentage}% | ${academics?.class10?.yearOfCompletion}`
        },
        {
            degree: 'Class 12',
            institution: academics?.class12?.school,
            details: `${academics?.class12?.percentage}% | ${academics?.class12?.yearOfCompletion}`
        },
        {
            degree: academics?.currentEducation?.course,
            institution: academics?.currentEducation?.institution,
            details: `Specialization: ${academics?.currentEducation?.specialization || 'None'} | CGPA: ${academics?.currentEducation?.cgpa} | Year: ${academics?.currentEducation?.yearOfStudy}`
        }
    ];

    educations.forEach(edu => {
        if(edu.institution) {
            y = addTimelineItem(doc, edu.degree, edu.institution, edu.details, margin, y);
            y += 2; // Add extra spacing between education items
        }
    });

    // Skills Section
    if(user.skills?.length > 0) {
        y = addSectionHeader(doc, 'Skills', margin, y + 15);
        y += 10;
        
        // Create skill categories if they exist
        const skills = user.skills.map(skill => 
            `${skill.name} (${skill.proficiency}%)`
        );
        y = addSkillBars(doc, user.skills, margin, y);
        y += 5;
    }

    // Check if we need a new page
    if (y > 240) {
        doc.addPage();
        y = margin;
    }

    // Professional Experience
    if(internships?.length > 0) {
        y = addSectionHeader(doc, 'Professional Experience', margin, y + 15);
        y += 12;
        
        internships.forEach((intern, index) => {
            // Add company and duration on same line with alignment
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(intern.company, margin, y);
            
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            doc.text(intern.duration, pageWidth - margin, y, { align: 'right' });
            y += 6;
            
            // Add role
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(intern.role, margin, y);
            y += 6;
            
            // Add description with proper wrapping
            if (intern.description) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                const descLines = doc.splitTextToSize(intern.description, pageWidth - (margin * 2) - 5);
                doc.text(descLines, margin + 5, y);
                y += descLines.length * 5 + 5;
            }
            
            // Add separator except for last item
            if (index < internships.length - 1) {
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.5);
                doc.line(margin, y, pageWidth - margin, y);
                y += 10;
            }
            
            // Check if we need a new page
            if (y > 250) {
                doc.addPage();
                y = margin;
            }
        });
    }

    // Achievements & Extracurricular
    if(achievements?.length > 0 || extracurricular?.length > 0) {
        y = addSectionHeader(doc, 'Achievements & Activities', margin, y + 15);
        y += 12;
        
        // First list achievements
        if(achievements?.length > 0) {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("Achievements", margin, y);
            y += 6;
            y = addBulletList(doc, achievements.map(a => a.title), margin, y);
            y += 8;
        }
        
        // Then list extracurricular activities
        if(extracurricular?.length > 0) {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("Extracurricular Activities", margin, y);
            y += 6;
            y = addBulletList(doc, extracurricular.map(e => e.activity), margin, y);
        }
        
        y += 5;
    }

    // Check if we need a new page
    if (y > 250) {
        doc.addPage();
        y = margin;
    }

    // Future Goals
    if(futureGoals) {
        y = addSectionHeader(doc, 'Future Goals', margin, y + 15);
        y += 12;
        
        if (futureGoals.shortTerm) {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("Short-term Goals", margin, y);
            y += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const stLines = doc.splitTextToSize(futureGoals.shortTerm, pageWidth - (margin * 2) - 5);
            doc.text(stLines, margin + 5, y);
            y += stLines.length * 5 + 8;
        }
        
        if (futureGoals.longTerm) {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("Long-term Goals", margin, y);
            y += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const ltLines = doc.splitTextToSize(futureGoals.longTerm, pageWidth - (margin * 2) - 5);
            doc.text(ltLines, margin + 5, y);
            y += ltLines.length * 5 + 8;
        }
        
        if (futureGoals.dreamCompanies?.length > 0) {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("Target Companies", margin, y);
            y += 6;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(futureGoals.dreamCompanies.join(', '), margin + 5, y);
            y += 5;
        }
    }

    // Footer with subtle design
    const footerY = doc.internal.pageSize.height - 15;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')} • Resume powered by OdysseyAI`, 
        pageWidth/2, footerY, { align: 'center' });

    // Save PDF
    doc.save(`${user.name.replace(/\s+/g, '_')}_Professional_Resume.pdf`);
}

// Improved helper functions
function addSectionHeader(doc, text, x, y) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 65, 122); // Match header color
    doc.text(text, x, y);
    
    // Better section divider
    const textWidth = doc.getTextWidth(text);
    doc.setDrawColor(41, 65, 122);
    doc.setLineWidth(1.5);
    doc.line(x, y + 2, x + textWidth, y + 2);
    
    // Add subtle full-width underline
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(x + textWidth + 5, y + 2, doc.internal.pageSize.width - x, y + 2);
    
    return y;
}

function addTimelineItem(doc, title, subtitle, details, x, y) {
    // Degree/qualification
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text(title, x, y);
    
    // Institution with right alignment
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(subtitle, doc.internal.pageSize.width - x, y, { align: 'right' });
    
    // Details
    if(details) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(details, x + 5, y + 7, { maxWidth: doc.internal.pageSize.width - (x * 2) - 5 });
        return y + 15; // More space after details
    }
    return y + 8; // More space between items
}

function addBulletList(doc, items, x, y, maxWidth = 170) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    let currentY = y;
    items.forEach((item) => {
        // Modern bullet point
        doc.setFillColor(41, 65, 122);
        doc.circle(x + 2, currentY - 2, 1.2, 'F');
        
        // Text with proper wrapping
        const lines = doc.splitTextToSize(item, maxWidth);
        doc.text(lines, x + 7, currentY);
        currentY += lines.length * 5 + 3; // Better spacing between bullet points
    });
    
    return currentY;
}

function addSkillBars(doc, skills, x, y) {
    const pageWidth = doc.internal.pageSize.width;
    const barWidth = pageWidth - (x * 2);
    const barHeight = 5;
    let currentY = y;
    
    skills.forEach(skill => {
        // Skill name
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(60, 60, 60);
        doc.text(skill.name, x, currentY);
        
        // Proficiency percentage
        doc.setFont("helvetica", "normal");
        doc.text(`${skill.proficiency}%`, pageWidth - x, currentY, { align: 'right' });
        currentY += 5;
        
        // Background bar
        doc.setFillColor(230, 230, 230);
        doc.roundedRect(x, currentY, barWidth, barHeight, 1, 1, 'F');
        
        // Progress bar
        const fillWidth = (skill.proficiency / 100) * barWidth;
        doc.setFillColor(41, 65, 122); // Main blue
        if (fillWidth > 0) {
            doc.roundedRect(x, currentY, fillWidth, barHeight, 1, 1, 'F');
        }
        
        currentY += barHeight + 8; // Space after each skill
    });
    
    return currentY;
}

// Function to check and add a new page if needed
function checkPageBreak(doc, y, margin = 20) {
    if (y > doc.internal.pageSize.height - 50) {
        doc.addPage();
        return margin;
    }
    return y;
}