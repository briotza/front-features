import { Moon, Sun, ToggleLeft, ToggleRight, Translate } from "@phosphor-icons/react";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { taskSchema } from "@/lib/validations/schema";
import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { i18n, t } = useTranslation();
  const [ languageSelected, setLanguageSelected] = useState(i18n.language)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const handleChangeLanguage = useCallback((language: string) => {
    i18n.changeLanguage(language);
    setLanguageSelected(language)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const colorNice = () => {
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-red");
    document.body.classList.remove("theme-nice");
  }
  const colorRed = () => {
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.add("theme-red");
  }
  const colorOrange = () => {
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-red");
    document.body.classList.add("theme-orange");
  }
  const colorGreen = () => {
    document.body.classList.remove("theme-red");
    document.body.classList.remove("theme-orange");
    document.body.classList.add("theme-green");
  }

  async function getTasks() {
    const res = await fetch(
      "https://my.api.mockaroo.com/tasks.json?key=f0933e60"
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();

    const tasks = z.array(taskSchema).parse(
      data.map((task: any) => {
        task.due_date = new Date(Date.parse(task.due_date));
        return task;
      })
    );
    return tasks;
  }

  const [tasks, setTasks]: any = useState([]);
  const getData = async () => {
    const tasksData = await getTasks();
    setTasks(tasksData);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="h-full flex items-center justify-center p-6 bg-background">
      <div className="bg-card rounded-md p-6 space-y-4 shadow-lg w-full sm:w-96 md:w-[500px] lg:w-[600px]">
        <div className="flex items-center gap-2">
          {theme === 'dark' ? (
            <>
              <Moon size={32} className="text-primary"/>
              <span className="text-primary">{t('Dark Mode')}</span>
              <button onClick={toggleTheme}>
                <ToggleLeft size={32} className="text-primary"/>
              </button>
            </>
          ) : (
            <>
              <Sun size={32} className="text-primary"/>
              <span className="text-primary">{t('Light Mode')}</span>
              <button onClick={toggleTheme}>
                <ToggleRight size={32} className="text-primary"/>
              </button>
            </>
          )}
        </div>
        <div>
          <h3 className="mb-2 text-primary">{t('Predominant Color')}</h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={colorRed} className="h-6 w-6 rounded-full bg-error-500"></button>
            <button onClick={colorOrange} className="h-6 w-6 rounded-full bg-alert300"></button>
            <button onClick={colorGreen} className="h-6 w-6 rounded-full bg-success300"></button>
            <button onClick={colorNice} className="h-6 w-6 rounded-full bg-blue200"></button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Translate size={32} className="text-primary"/>
          <select name="select" onChange={(e) => handleChangeLanguage(e.target.value)} defaultValue={i18n.language} className="bg-card text-primary">
            <option value="en-US">{t('Select Language')}</option>
            <option value="en-US">{t('English')}</option>
            <option value="pt-BR">{t('Portuguese')}</option>
          </select>
        </div>
        <h3 className="text-primary font-bold">{t('Hello World')}</h3>
        <div className="text-foreground overflow-y-auto">
          <DataTable data={tasks} columns={columns}/>
        </div>
      </div>
    </div>
  );
}