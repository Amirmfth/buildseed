"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

import { AIGenerateBlueprint } from "@/components/ai/AIGenerateBlueprint";
import { DeveloperFieldStep } from "@/components/survey/DeveloperFieldStep";
import { ResultsGrid } from "@/components/results/ResultsGrid";
import { SurveyStep } from "@/components/survey/SurveyStep";
import { TechStackStep } from "@/components/survey/TechStackStep";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { surveySteps } from "@/data/surveyOptions";
import { matchProjects } from "@/lib/matcher";
import { buttonClasses, surfaceClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import type {
  EstimatedTime,
  Feature,
  ProjectIdea,
  ProjectCategory,
  ProjectGoal,
  SkillLevel,
  SurveyAnswers,
  SurveyStepKey,
} from "@/lib/types";

const initialAnswers: SurveyAnswers = {
  developerFields: [],
  stacks: [],
  customStacks: [],
  features: [],
};

export function ProjectMatchSurvey({ blueprints }: { blueprints: ProjectIdea[] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(initialAnswers);
  const [submitted, setSubmitted] = useState(false);

  const step = surveySteps[activeStep];
  const matches = useMemo(
    () => (submitted ? matchProjects(answers, blueprints) : []),
    [answers, blueprints, submitted]
  );

  const progress = submitted
    ? 100
    : ((activeStep + 1) / surveySteps.length) * 100;
  const selectedValues = getSelectedValues(answers, step.key);
  const isSkippable = "skippable" in step && step.skippable;
  const canContinue =
    step.key === "stacks"
      ? answers.stacks.length + answers.customStacks.length > 0
      : selectedValues.length > 0;

  function toggleValue(value: string) {
    setAnswers((current) => {
      if (step.key === "developerFields") {
        return {
          ...current,
          developerFields: toggleFromArray(current.developerFields, value),
        };
      }

      if (step.key === "stacks") {
        return {
          ...current,
          stacks: toggleFromArray(current.stacks, value),
        };
      }

      if (step.key === "features") {
        return {
          ...current,
          features: toggleFromArray(current.features, value as Feature),
        };
      }

      return {
        ...current,
        [step.key]: value,
      };
    });
  }

  function addCustomStack(value: string) {
    setAnswers((current) => {
      if (current.customStacks.some((stack) => sameText(stack, value))) {
        return current;
      }

      return {
        ...current,
        customStacks: [...current.customStacks, value],
      };
    });
  }

  function removeCustomStack(value: string) {
    setAnswers((current) => ({
      ...current,
      customStacks: current.customStacks.filter((stack) => stack !== value),
    }));
  }

  function resetSurvey() {
    setAnswers(initialAnswers);
    setActiveStep(0);
    setSubmitted(false);
  }

  function skipStep() {
    setAnswers((current) => clearAnswerForStep(current, step.key));

    if (activeStep === surveySteps.length - 1) {
      setSubmitted(true);
      return;
    }

    setActiveStep((value) => Math.min(surveySteps.length - 1, value + 1));
  }

  if (submitted) {
    return (
      <section
        id="matches"
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
          className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
              Your matches
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
              Top project ideas for your answers
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Ranked by stack fit, goal alignment, category, available time,
              feature practice, and difficulty.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={resetSurvey}
            className={cn("h-11", buttonClasses.outline)}
          >
            <RotateCcw className="size-4" />
            Start over
          </Button>
        </motion.div>
        <ResultsGrid matches={matches} answers={answers} />
        <AIGenerateBlueprint answers={answers} />
      </section>
    );
  }

  return (
    <section
      id="project-match"
      className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8"
    >
      <div className="absolute inset-x-4 top-8 -z-10 h-72 rounded-full bg-green-500/8 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.45 }}
        className={cn("overflow-hidden rounded-2xl", surfaceClasses.panel)}
      >
        <div className="border-b border-[#3F3F46]/55 bg-[#09090B]/35 p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Sparkles className="size-4 text-green-400" />
                Project match survey
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                Answer seven quick prompts to get scoped project matches.
              </p>
            </div>
            <div className="min-w-48">
              <div className="mb-2 flex items-center justify-between font-mono text-xs text-zinc-500">
                <span>
                  Step {activeStep + 1}/{surveySteps.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress
                value={progress}
                className="bg-[#27272A] [&_[data-slot=progress-indicator]]:bg-green-500"
              />
            </div>
          </div>

          <ol className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-7">
            {surveySteps.map((item, index) => (
              <li key={item.key}>
                <div
                  className={cn(
                    "flex min-h-12 flex-col justify-between rounded-xl border px-3 py-2 text-xs transition",
                    index === activeStep
                      ? "border-green-500/55 bg-green-500/10 text-zinc-50"
                      : index < activeStep
                        ? "border-[#3F3F46]/65 bg-[#27272A]/60 text-zinc-300"
                        : "border-[#3F3F46]/35 bg-[#18181B]/65 text-zinc-500"
                  )}
                >
                  <span className="truncate font-medium">
                    {item.shortTitle}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="min-h-[430px]">
            <AnimatePresence mode="wait">
              {step.key === "developerFields" ? (
                <DeveloperFieldStep
                  key="developerFields"
                  selectedValues={answers.developerFields}
                  onChange={toggleValue}
                />
              ) : step.key === "stacks" ? (
                <TechStackStep
                  key="stacks"
                  developerFields={answers.developerFields}
                  selectedStacks={answers.stacks}
                  customStacks={answers.customStacks}
                  onToggleStack={toggleValue}
                  onAddCustomStack={addCustomStack}
                  onRemoveCustomStack={removeCustomStack}
                />
              ) : (
                <SurveyStep
                  key={step.key}
                  eyebrow={step.eyebrow}
                  title={step.title}
                  description={step.description}
                  options={[...("options" in step ? step.options : [])]}
                  selectedValues={selectedValues}
                  multiple={"multiple" in step ? step.multiple : false}
                  onChange={toggleValue}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#3F3F46]/45 pt-5 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((value) => Math.max(0, value - 1))}
              className={cn("h-11", buttonClasses.outline)}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>

            <div className="flex flex-col gap-3 sm:flex-row">
              {isSkippable ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={skipStep}
                  className={cn("h-11", buttonClasses.outline)}
                >
                  {activeStep === surveySteps.length - 1
                    ? "Skip and show matches"
                    : "Skip"}
                </Button>
              ) : null}

              {activeStep === surveySteps.length - 1 ? (
                <Button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setSubmitted(true)}
                  className={cn("h-11 px-5", buttonClasses.primary)}
                >
                  <Sparkles className="size-4" />
                  Show Matches
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={!canContinue}
                  onClick={() =>
                    setActiveStep((value) =>
                      Math.min(surveySteps.length - 1, value + 1)
                    )
                  }
                  className={cn("h-11 px-5", buttonClasses.primary)}
                >
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function toggleFromArray<T>(items: T[], value: T) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

function getSelectedValues(
  answers: SurveyAnswers,
  key: SurveyStepKey
) {
  if (key === "developerFields") return answers.developerFields;
  if (key === "stacks") return answers.stacks;
  if (key === "customStacks") return answers.customStacks;
  if (key === "features") return answers.features;
  const value = answers[key] as
    | SkillLevel
    | ProjectGoal
    | ProjectCategory
    | EstimatedTime
    | undefined;
  return value ? [value] : [];
}

function sameText(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function clearAnswerForStep(
  answers: SurveyAnswers,
  key: SurveyStepKey
): SurveyAnswers {
  if (key === "features") {
    return { ...answers, features: [] };
  }

  if (key === "skillLevel") {
    return { ...answers, skillLevel: undefined };
  }

  if (key === "goal") {
    return { ...answers, goal: undefined };
  }

  if (key === "category") {
    return { ...answers, category: undefined };
  }

  if (key === "availableTime") {
    return { ...answers, availableTime: undefined };
  }

  return answers;
}
