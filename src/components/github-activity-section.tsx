'use client';

import { useTheme } from 'next-themes';
import { GitHubCalendar } from 'react-github-calendar';
import AnimatedDiv from './animated-div';
import { motion } from 'framer-motion';
import { Github, GitPullRequest, Flame, Trophy } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const GITHUB_USERNAME = 'HakkanShah';

interface GitHubStats {
    publicRepos: number;
    totalPRs: number;
    topLanguage: string;
    languages: { name: string; percentage: number; color: string }[];
}

// Language colors from GitHub
const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    CSS: '#563d7c',
    HTML: '#e34c26',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    EJS: '#a91e50',
    Shell: '#89e051',
    SCSS: '#c6538c',
    Vue: '#41b883',
};

// GitHub achievement badges
const ACHIEVEMENTS = [
    { name: 'Pull Shark', img: 'https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png' },
    { name: 'YOLO', img: 'https://github.githubassets.com/assets/yolo-default-be0bbff04951.png' },
    { name: 'Quickdraw', img: 'https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png' },
    { name: 'Pair Extraordinaire', img: 'https://user-images.githubusercontent.com/101352977/178841186-98adb2c7-3c39-4e69-8251-09891cbe1983.png' },
];

const GitHubActivitySection = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const calendarScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        const fetchStats = async () => {
            try {
                const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
                const userData = await userRes.json();

                // Hardcoded language percentages (totals 100%)
                const languages = [
                    { name: 'TypeScript', percentage: 70.62, color: LANGUAGE_COLORS['TypeScript'] },
                    { name: 'JavaScript', percentage: 16.32, color: LANGUAGE_COLORS['JavaScript'] },
                    { name: 'CSS', percentage: 8.38, color: LANGUAGE_COLORS['CSS'] },
                    { name: 'HTML', percentage: 4.22, color: LANGUAGE_COLORS['HTML'] },
                    { name: 'EJS', percentage: 0.25, color: LANGUAGE_COLORS['EJS'] },
                    { name: 'Python', percentage: 0.21, color: LANGUAGE_COLORS['Python'] },
                ];

                // Total PRs - update with your actual count
                const totalPRs = 15;

                setStats({
                    publicRepos: userData.public_repos || 0,
                    totalPRs,
                    topLanguage: 'TypeScript',
                    languages,
                });
            } catch (error) {
                console.error('Failed to fetch GitHub stats:', error);
            }
        };

        fetchStats();
    }, []);

    // Scroll to show recent contributions on mobile
    useEffect(() => {
        if (mounted && calendarScrollRef.current) {
            // Small delay to ensure calendar is rendered
            setTimeout(() => {
                if (calendarScrollRef.current) {
                    calendarScrollRef.current.scrollLeft = calendarScrollRef.current.scrollWidth;
                }
            }, 500);
        }
    }, [mounted]);

    const calendarTheme = {
        light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    };

    const statItems = [
        {
            icon: Github,
            label: 'Repositories(Public)',
            value: stats?.publicRepos ?? '...',
            color: 'text-purple-500'
        },
        {
            icon: Flame,
            label: 'Longest Streak',
            value: '77 days',
            subtitle: 'Mar 5 - May 20',
            color: 'text-orange-500'
        },
        {
            icon: GitPullRequest,
            label: 'Total PRs',
            value: stats?.totalPRs ?? '...',
            color: 'text-green-500'
        },
        {
            icon: Trophy,
            label: 'Achievements',
            value: ACHIEVEMENTS.length,
            color: 'text-yellow-500'
        },
    ];

    if (!mounted) {
        return null;
    }

    return (
        <section id="github" className="section-padding bg-muted/30 dark:bg-muted/10 border-y-4 border-foreground overflow-hidden">
            <div className="section-container">
                <AnimatedDiv className="text-center mb-12" variant="scale">
                    <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-wider">
                        GitHub Activity
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground px-4">
                        My coding journey visualized — consistency is key! 🚀
                    </p>
                </AnimatedDiv>

                {/* Stats Cards */}
                <AnimatedDiv delay={200} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {statItems.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-background p-4 sm:p-6 rounded-xl border-2 border-foreground shadow-md hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                                <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                                    {stat.label}
                                </span>
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">
                                {stat.value}
                            </p>
                            {'subtitle' in stat && stat.subtitle && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.subtitle}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </AnimatedDiv>

                {/* Languages & Achievements Row */}
                <AnimatedDiv delay={300} className="grid md:grid-cols-2 gap-6 mb-10">
                    {/* Most Used Languages */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-background p-4 sm:p-6 rounded-xl border-2 border-foreground shadow-lg"
                    >
                        <h3 className="font-headline text-xl sm:text-2xl font-bold text-foreground mb-4">
                            Most Used Languages
                        </h3>

                        {/* Language Bar */}
                        <div className="h-4 rounded-full overflow-hidden flex mb-4">
                            {stats?.languages.map((lang, i) => (
                                <div
                                    key={lang.name}
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${lang.percentage}%`,
                                        backgroundColor: lang.color,
                                    }}
                                    title={`${lang.name}: ${lang.percentage}%`}
                                />
                            ))}
                        </div>

                        {/* Language Legend */}
                        <div className="grid grid-cols-2 gap-2">
                            {stats?.languages.map((lang) => (
                                <div key={lang.name} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: lang.color }}
                                    />
                                    <span className="text-sm text-foreground">{lang.name}</span>
                                    <span className="text-xs text-muted-foreground">{lang.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Achievements */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-background p-4 sm:p-6 rounded-xl border-2 border-foreground shadow-lg"
                    >
                        <h3 className="font-headline text-xl sm:text-2xl font-bold text-foreground mb-4">
                            Achievements
                        </h3>

                        <div className="flex flex-wrap gap-4 justify-center">
                            {ACHIEVEMENTS.map((achievement, index) => (
                                <motion.div
                                    key={achievement.name}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="relative group"
                                >
                                    <Image
                                        src={achievement.img}
                                        alt={achievement.name}
                                        width={64}
                                        height={64}
                                        unoptimized
                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-foreground/20 shadow-md"
                                    />
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                        {achievement.name}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatedDiv>

                {/* Contribution Calendar */}
                <AnimatedDiv delay={400}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-background rounded-xl border-2 border-foreground shadow-lg overflow-hidden"
                    >
                        {/* Sticky Header - Outside scroll area */}
                        <div className="flex items-center gap-3 p-4 sm:p-6 md:px-8 md:pt-8 md:pb-4 bg-background sticky top-0 z-10">
                            <Github className="w-6 h-6 text-primary" />
                            <h3 className="font-headline text-xl sm:text-2xl font-bold text-foreground">
                                Contribution Graph
                            </h3>
                        </div>

                        {/* Scrollable Calendar Area */}
                        <div
                            ref={calendarScrollRef}
                            className="overflow-x-auto px-4 sm:px-6 md:px-8 pb-4"
                        >
                            <div className="flex justify-center min-w-[750px] md:min-w-0">
                                <GitHubCalendar
                                    username={GITHUB_USERNAME}
                                    colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                                    theme={calendarTheme}
                                    fontSize={12}
                                    blockSize={12}
                                    blockMargin={4}
                                    blockRadius={2}
                                    labels={{
                                        totalCount: '{{count}} contributions in the last year',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-2 px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 text-xs text-muted-foreground">
                            <span>Less</span>
                            <div className="flex gap-1">
                                {(resolvedTheme === 'dark' ? calendarTheme.dark : calendarTheme.light).map((color, i) => (
                                    <div
                                        key={i}
                                        className="w-3 h-3 rounded-sm"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <span>More</span>
                        </div>
                    </motion.div>
                </AnimatedDiv>

                {/* View Profile Button */}
                <AnimatedDiv delay={600} className="mt-8 text-center">
                    <motion.a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-headline text-lg tracking-wider rounded-lg border-2 border-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md hover:shadow-xl"
                    >
                        <Github className="w-5 h-5" />
                        View Full Profile
                    </motion.a>
                </AnimatedDiv>
            </div>
        </section>
    );
};

export default GitHubActivitySection;
