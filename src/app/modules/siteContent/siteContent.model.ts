import { Schema, model } from 'mongoose';

// ── Ticker Item ──
const tickerItemSchema = new Schema({
    text: { type: String, required: true },
    emoji: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { _id: true });

// ── Contact Info ──
const businessHourSchema = new Schema({
    day: { type: String, required: true },
    time: { type: String, required: true },
}, { _id: true });

const socialLinkSchema = new Schema({
    label: { type: String, required: true },
    url: { type: String, default: '#' },
    color: { type: String, default: '#000000' },
}, { _id: true });

// ── Main Site Content Schema ──
const siteContentSchema = new Schema({
    // Only one document — singleton
    _key: { type: String, default: 'main', unique: true },

    // ── Header Ticker ──
    ticker: [tickerItemSchema],

    // ── Contact Page ──
    contact: {
        phone: { type: String, default: '' },            // primary phone (for tel: links)
        phones: { type: [String], default: [] },         // additional phones — shown as list
        whatsapp: { type: String, default: '' },
        email: { type: String, default: '' },
        emails: { type: [String], default: [] },         // additional emails
        address: { type: String, default: '' },
        corporateOffice: { type: String, default: '' },  // corporate/head office address
        warehouse: { type: String, default: '' },        // warehouse address
        website: { type: String, default: '' },
        hours: [businessHourSchema],
        tips: [{ type: String }],
        socials: [socialLinkSchema],
        subjects: [{ type: String }],
    },

    // ── Floating Widget ──
    floating: {
        phone: { type: String, default: '' },
        whatsapp: { type: String, default: '' },
        messenger: { type: String, default: '' },
        showPhone: { type: Boolean, default: true },
        showWhatsapp: { type: Boolean, default: true },
        showMessenger: { type: Boolean, default: true },
    },

    // ── Mobile Payment Numbers (bKash / Rocket / Nagad) ──
    payment: {
        bkash:  { number: { type: String, default: '' }, accountType: { type: String, default: 'Personal' }, active: { type: Boolean, default: true } },
        rocket: { number: { type: String, default: '' }, accountType: { type: String, default: 'Personal' }, active: { type: Boolean, default: true } },
        nagad:  { number: { type: String, default: '' }, accountType: { type: String, default: 'Personal' }, active: { type: Boolean, default: true } },
        cod:    { active: { type: Boolean, default: true } }, // Cash on Delivery show/hide toggle
        instructions: { type: String, default: 'Send Money to the number above, then submit your number, transaction ID and payment time below.' },
    },

    // ── Footer ──
    footer: {
        companyName: { type: String, default: 'Anandabazar BDMart' },
        copyright: { type: String, default: '' },
        links: [{
            label: { type: String, required: true },
            url: { type: String, required: true },
        }],
    },

    // ── Default Product Tagline ──
    defaultTagline: { type: String, default: 'Your trusted online marketplace' },

    // ── SEO / Meta ──
    seo: {
        title: { type: String, default: 'Anandabazar BDMart - Your trusted online marketplace' },
        description: { type: String, default: 'Shop the latest products with amazing deals at Anandabazar BDMart.' },
        keywords: { type: String, default: 'anandabazar bdmart, anandabazarbdmart, ecommerce, online shopping' },
    },

    // ── Announcement Bar ──
    announcement: {
        message: { type: String, default: '' },
        bgColor: { type: String, default: '#E4525C' },
        textColor: { type: String, default: '#FFFFFF' },
        active: { type: Boolean, default: false },
        dismissible: { type: Boolean, default: true },
    },

    // ── Legal Pages (Terms, Privacy, Refund) ──
    legalPages: [{
        slug: { type: String, required: true, enum: ['terms', 'privacy', 'refund'] },
        title: { type: String, required: true },
        content: { type: String, default: '' },
        active: { type: Boolean, default: true },
        lastUpdated: { type: Date, default: Date.now },
    }],

    // ── Theme / Appearance ──
    theme: {
        primaryColor: { type: String, default: '#4F46E5' },
        secondaryColor: { type: String, default: '#6366F1' },
        logoUrl: { type: String, default: '/images/logo.png' },
        faviconUrl: { type: String, default: '' },
    },

    // ── Hero Slides ──
    heroSlides: [{
        imageUrl: { type: String, required: true },
        active: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    }],

}, { timestamps: true });

export const SiteContent = model('SiteContent', siteContentSchema);
