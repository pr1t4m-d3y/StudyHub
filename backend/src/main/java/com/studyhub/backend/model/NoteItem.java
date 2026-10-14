package com.studyhub.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class NoteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String subject;
    @Lob
    private String content;
    private String dateFormatted;
    private String icon;

    public NoteItem() {}

    public NoteItem(String title, String subject, String content, String dateFormatted, String icon) {
        this.title = title;
        this.subject = subject;
        this.content = content;
        this.dateFormatted = dateFormatted;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getDateFormatted() { return dateFormatted; }
    public void setDateFormatted(String dateFormatted) { this.dateFormatted = dateFormatted; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
