import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="border-t pt-6 mt-6 border-gray-200 first:border-t-0 first:mt-0 first:pt-0">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-3 text-gray-700 leading-relaxed">
            {children}
        </div>
    </section>
);

const Feature: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => {
    const textWithBold = () => {
        const parts = children?.toString().split('**');
        return parts?.map((part, index) =>
            index % 2 === 1 ? <strong key={index} className="font-semibold text-gray-800">{part}</strong> : part
        );
    };
    return (
        <div className="flex items-start space-x-3">
            <span className="text-2xl mt-1">{icon}</span>
            <p>{textWithBold()}</p>
        </div>
    );
};

const HowToUseView: React.FC = () => {
    const t = useTranslation();
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">{t('howToUseApp')}</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">

                <Section title={t('guideWelcomeTitle')}>
                    <p>{t('guideWelcomeText')}</p>
                </Section>
                
                <Section title={t('guideFeaturesTitle')}>
                    <Feature icon="💊">{t('guideFeatureMeds')}</Feature>
                    <Feature icon="❤️">{t('guideFeatureBP')}</Feature>
                    <Feature icon="📜">{t('guideFeatureHistory')}</Feature>
                    <Feature icon="💾">{t('guideFeatureBackup')}</Feature>
                </Section>

                <Section title={t('guideExamplesTitle')}>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-semibold text-gray-800">{t('guideExampleMedsTitle')}</h4>
                        <p className="text-sm">{t('guideExampleMedsText')}</p>
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-semibold text-gray-800">{t('guideExampleBPTitle')}</h4>
                        <p className="text-sm">{t('guideExampleBPText')}</p>
                    </div>
                </Section>
                
                <Section title={t('guideProTipsTitle')}>
                     <Feature icon="💡">{t('guideProTip1')}</Feature>
                     <Feature icon="🔔">{t('guideProTip2')}</Feature>
                     <Feature icon="✍️">{t('guideProTip3')}</Feature>
                     <Feature icon="🛡️">{t('guideProTip4')}</Feature>
                </Section>

                <Section title={t('installTitle')}>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>{t('installStep1')}</li>
                        <li>{t('installStep2')}</li>
                        <li>{t('installStep3')}</li>
                        <li>{t('installStep4')}</li>
                        <li>{t('installStep5')}</li>
                    </ol>
                </Section>

                <Section title={t('securityWarningTitle')}>
                    <p className="text-justify">{t('securityWarningText1')}</p>
                    <p className="font-semibold text-blue-700 text-justify">{t('securityWarningText2')}</p>
                    <p className="mb-2 font-semibold">{t('securityWarningText3')}</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><span className="text-justify">{t('securityPoint1')}</span></li>
                        <li><span className="text-justify">{t('securityPoint2')}</span></li>
                        <li><span className="text-justify">{t('securityPoint3')}</span></li>
                        <li><span className="text-justify">{t('securityPoint4')}</span></li>
                    </ul>
                </Section>
            </div>
        </div>
    );
};

export default HowToUseView;